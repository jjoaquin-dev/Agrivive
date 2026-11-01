import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, sellers_product, vegetable_catalog } from "../../../db/schema";
import { priceToCents } from "../../../utils/order-amount";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { validateLowStockThreshold } from "../../../utils/product-threshold";
import { validateProductImageReference } from "../../../utils/product-image";
import { normalizeVegetableName } from "../../../utils/vegetable-identity";
import type { SellerProductUpdate } from "../model/seller.product";
import { validatePriceReductionConfig } from "../../../utils/price-reduction";
import { queueFirstPublicListing, queueSellerListingEvent } from "../../../utils/seller-listing-event";
import { sendSellerListingNotices } from "../../../jobs/send-seller-listing-notices";

export async function updateSellerProduct(sellerId: string, productId: string, body: SellerProductUpdate) {
  validateLowStockThreshold(body.lowStockThreshold);
  if (body.imagUrl !== undefined) validateProductImageReference(body.imagUrl, sellerId);
  if (Object.keys(body).length === 0) throw new OrderError(400, "At least one product field is required");
  if (body.productPrice !== undefined && priceToCents(body.productPrice) === null) {
    throw new OrderError(400, "Product price must have at most two decimal places");
  }
  const updated = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [current] = await tx.select().from(sellers_product).where(and(
      eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId),
    )).for("update").limit(1);
    if (!current) throw new OrderError(404, "Product not found");
    const pricingChanged = body.productPrice !== undefined ||
      body.priceReductionAmount !== undefined || body.minimumPrice !== undefined;
    const basePrice = body.productPrice ?? Number(current.productPrice ?? current.basePrice ?? 0);
    const reductionAmount = body.priceReductionAmount ?? Number(current.priceReductionAmount ?? 0);
    const minimumPrice = body.minimumPrice !== undefined
      ? body.minimumPrice
      : (current.minimumPrice === null ? null : Number(current.minimumPrice));
    if (pricingChanged) validatePriceReductionConfig(basePrice, reductionAmount, minimumPrice);
    const initializingLegacy = current.isActive && !current.originalQty && Number(current.productQty) > 0;
    let catalog: { id: string; filipinoName: string; category: "Leafy Greens" | "Root Vegetables" | "Bulb Vegetables" | "Stem Vegetables" | "Flower Vegetables" | "Fruit Vegetables" | "Pod Vegetables" | "Tuber Vegetables" | "Seed Vegetables" } | null = null;
    if (body.catalogId !== undefined) {
      const [selectedCatalog] = await tx.select({
        id: vegetable_catalog.id,
        filipinoName: vegetable_catalog.filipinoName,
        category: vegetable_catalog.category,
      }).from(vegetable_catalog).where(and(
        eq(vegetable_catalog.id, body.catalogId),
        eq(vegetable_catalog.isActive, true),
        eq(vegetable_catalog.reviewStatus, "approved"),
      )).limit(1);
      if (!selectedCatalog) throw new OrderError(400, "Choose an active vegetable from the catalog");
      catalog = selectedCatalog;
    }
    const name = catalog?.filipinoName.trim();
    const now = new Date();
    const [updatedProduct] = await tx.update(sellers_product).set({
      ...(catalog ? {
        vegetableCatalogId: catalog.id,
        productName: name,
        productType: catalog.category,
      } : {}),
      ...(body.imagUrl !== undefined ? { imagUrl: body.imagUrl } : {}),
      ...(pricingChanged ? {
        productPrice: basePrice.toString(),
        basePrice: basePrice.toString(),
        priceReductionAmount: reductionAmount.toString(),
        minimumPrice: minimumPrice?.toString() ?? null,
        priceScheduleStartedAt: now,
        priceReductionPeriodsApplied: 0,
      } : {}),
      ...(body.lowStockThreshold !== undefined ? { lowStockThreshold: body.lowStockThreshold?.toString() ?? null } : {}),
      ...(body.condition !== undefined ? { condition: body.condition } : {}),
      ...(body.isMarketable !== undefined ? { isMarketable: body.isMarketable } : {}),
      ...(initializingLegacy ? {
        originalQty: current.productQty,
        publishedAt: now,
        basePrice: current.productPrice,
        priceScheduleStartedAt: now,
        priceReductionPeriodsApplied: 0,
      } : {}),
      updatedAt: now,
    }).where(eq(sellers_product.id, productId)).returning();
    if (initializingLegacy && updatedProduct.originalQty) {
      await tx.insert(listing_cycles).values({
        productId,
        vegetableCatalogId: updatedProduct.vegetableCatalogId,
        scalingType: updatedProduct.scalingType,
        vegetableKey: normalizeVegetableName(updatedProduct.productName),
        startedAt: now,
        originalQty: updatedProduct.originalQty,
      });
    }
    if (body.productPrice !== undefined && Number(current.productPrice ?? 0) > Number(basePrice)) {
      await queueSellerListingEvent(tx, productId, "price_drop", {
        oldPrice: current.productPrice ?? undefined,
        newPrice: basePrice.toString(),
      });
    } else {
      await queueFirstPublicListing(tx, updatedProduct.id);
    }
    return updatedProduct;
  });
  void sendSellerListingNotices().catch(() => {});
  return updated;
}

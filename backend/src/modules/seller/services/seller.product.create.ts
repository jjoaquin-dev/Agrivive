import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, sellers_product, vegetable_catalog } from "../../../db/schema";
import { priceToCents, quantityToHundredths } from "../../../utils/order-amount";
import { OrderError } from "../../../utils/order-types";
import type { SellerProductCreate } from "../model/seller.product.create";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { validateLowStockThreshold } from "../../../utils/product-threshold";
import { validateProductImageReference } from "../../../utils/product-image";
import { normalizeVegetableName } from "../../../utils/vegetable-identity";
import { validatePriceReductionConfig } from "../../../utils/price-reduction";
import { queueFirstPublicListing } from "../../../utils/seller-listing-event";
import { sendSellerListingNotices } from "../../../jobs/send-seller-listing-notices";

export async function createSellerProduct(userId: string, body: SellerProductCreate) {
  validateLowStockThreshold(body.lowStockThreshold);
  validateProductImageReference(body.imagUrl, userId);
  if (quantityToHundredths(body.productQty) === null) {
    throw new OrderError(400, "Product quantity must have at most two decimal places");
  }
  if (priceToCents(body.productPrice) === null) {
    throw new OrderError(400, "Product price must be between 1 and 99999999.99 with at most two decimal places");
  }
  validatePriceReductionConfig(body.productPrice, body.priceReductionPercent, body.minimumPrice);
  const postProduct = await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${userId}), 3)`);
    await requireVerifiedSeller(tx, userId);
    const [catalog] = await tx.select({
      id: vegetable_catalog.id,
      filipinoName: vegetable_catalog.filipinoName,
      category: vegetable_catalog.category,
    }).from(vegetable_catalog).where(and(
      eq(vegetable_catalog.id, body.catalogId),
      eq(vegetable_catalog.isActive, true),
      eq(vegetable_catalog.reviewStatus, "approved"),
    )).limit(1);
    if (!catalog) throw new OrderError(400, "Choose an active vegetable from the catalog");

    const productName = catalog.filipinoName.trim();
    const now = new Date();
    const { catalogId: _catalogId, ...productFields } = body;
    const [created] = await tx
      .insert(sellers_product)
      .values({
        ...productFields,
        vegetableCatalogId: catalog.id,
        productName,
        productType: catalog.category,
        productPrice: body.productPrice.toString(),
        basePrice: body.productPrice.toString(),
        priceReductionPercent: (body.priceReductionPercent ?? 0).toString(),
        minimumPrice: body.minimumPrice?.toString() ?? null,
        priceScheduleStartedAt: now,
        priceReductionPeriodsApplied: 0,
        productQty: body.productQty.toString(),
        lowStockThreshold: body.lowStockThreshold?.toString() ?? null,
        condition: body.condition ?? "needs_inspection",
        originalQty: body.productQty.toString(),
        publishedAt: now,
        isMarketable: body.isMarketable,
        userId,
      })
      .returning();

    if (!created) throw new Error("Failed to post product");
    await tx.insert(listing_cycles).values({
      productId: created.id,
      vegetableCatalogId: catalog.id,
      scalingType: body.scalingType,
      vegetableKey: normalizeVegetableName(productName),
      startedAt: now,
      originalQty: body.productQty.toString(),
    });
    await queueFirstPublicListing(tx, created.id);
    return created;
  });
  void sendSellerListingNotices().catch(() => {});
  return postProduct;
}

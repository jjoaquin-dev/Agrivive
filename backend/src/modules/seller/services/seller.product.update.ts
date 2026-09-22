import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, sellers_product } from "../../../db/schema";
import { priceToCents } from "../../../utils/order-amount";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { validateLowStockThreshold } from "../../../utils/product-threshold";
import { validateProductImageReference } from "../../../utils/product-image";
import { normalizeVegetableName } from "../../../utils/vegetable-identity";
import type { SellerProductUpdate } from "../model/seller.product";

export function updateSellerProduct(sellerId: string, productId: string, body: SellerProductUpdate) {
  validateLowStockThreshold(body.lowStockThreshold);
  if (body.imagUrl !== undefined) validateProductImageReference(body.imagUrl, sellerId);
  if (Object.keys(body).length === 0) throw new OrderError(400, "At least one product field is required");
  if (body.productPrice !== undefined && priceToCents(body.productPrice) === null) {
    throw new OrderError(400, "Product price must have at most two decimal places");
  }
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [current] = await tx.select().from(sellers_product).where(and(
      eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId),
    )).for("update").limit(1);
    if (!current) throw new OrderError(404, "Product not found");
    const name = body.productName?.trim();
    const initializingLegacy = current.isActive && !current.originalQty && Number(current.productQty) > 0;
    if (name !== undefined) {
      if (!name) throw new OrderError(400, "Product name is required");
      if (name.toLowerCase() !== current.productName.trim().toLowerCase()) {
        await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${sellerId}), hashtext(${`${name.toLowerCase()}:${current.scalingType}`}))`);
        const [duplicate] = await tx.select({ id: sellers_product.id }).from(sellers_product).where(and(
          eq(sellers_product.userId, sellerId), eq(sellers_product.scalingType, current.scalingType),
          ne(sellers_product.id, productId),
          sql`lower(btrim(${sellers_product.productName})) = ${name.toLowerCase()}`,
        )).limit(1);
        if (duplicate) throw new OrderError(409, "Product already listed with this selling unit");
      }
    }
    const now = new Date();
    const [updated] = await tx.update(sellers_product).set({
      ...(name !== undefined ? { productName: name } : {}),
      ...(body.imagUrl !== undefined ? { imagUrl: body.imagUrl } : {}),
      ...(body.productPrice !== undefined ? { productPrice: body.productPrice.toString() } : {}),
      ...(body.productType !== undefined ? { productType: body.productType } : {}),
      ...(body.lowStockThreshold !== undefined ? { lowStockThreshold: body.lowStockThreshold?.toString() ?? null } : {}),
      ...(body.isMarketable !== undefined ? { isMarketable: body.isMarketable } : {}),
      ...(initializingLegacy ? { originalQty: current.productQty, publishedAt: now } : {}),
      updatedAt: now,
    }).where(eq(sellers_product.id, productId)).returning();
    if (initializingLegacy && updated.originalQty) {
      await tx.insert(listing_cycles).values({
        productId,
        vegetableKey: normalizeVegetableName(updated.productName),
        startedAt: now,
        originalQty: updated.originalQty,
      });
    }
    return updated;
  });
}

import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, sellers_product } from "../../../db/schema";
import { priceToCents, quantityToHundredths } from "../../../utils/order-amount";
import { OrderError } from "../../../utils/order-types";
import type { SellerProductCreate } from "../model/seller.product.create";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { validateLowStockThreshold } from "../../../utils/product-threshold";
import { validateProductImageReference } from "../../../utils/product-image";
import { normalizeVegetableName } from "../../../utils/vegetable-identity";

export async function createSellerProduct(userId: string, body: SellerProductCreate) {
  validateLowStockThreshold(body.lowStockThreshold);
  validateProductImageReference(body.imagUrl, userId);
  if (quantityToHundredths(body.productQty) === null) {
    throw new OrderError(400, "Product quantity must have at most two decimal places");
  }
  if (priceToCents(body.productPrice) === null) {
    throw new OrderError(400, "Product price must be between 1 and 99999999.99 with at most two decimal places");
  }
  const productName = body.productName.trim();
  const normalizedName = productName.toLowerCase();
  const lockKey = `${normalizedName}:${body.scalingType}`;

  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${userId}), 3)`);
    await requireVerifiedSeller(tx, userId);
    await tx.execute(sql`
      select pg_advisory_xact_lock(hashtext(${userId}), hashtext(${lockKey}))
    `);

    const [existing] = await tx
      .select({ id: sellers_product.id })
      .from(sellers_product)
      .where(
        and(
          eq(sellers_product.userId, userId),
          eq(sellers_product.scalingType, body.scalingType),
          sql`lower(btrim(${sellers_product.productName})) = ${normalizedName}`,
        ),
      )
      .limit(1);
    if (existing) return null;

    const now = new Date();
    const [postProduct] = await tx
      .insert(sellers_product)
      .values({
        ...body,
        productName,
        productPrice: body.productPrice.toString(),
        productQty: body.productQty.toString(),
        lowStockThreshold: body.lowStockThreshold?.toString() ?? null,
        originalQty: body.productQty.toString(),
        publishedAt: now,
        isMarketable: body.isMarketable,
        userId,
      })
      .returning();

    if (!postProduct) throw new Error("Failed to post product");
    await tx.insert(listing_cycles).values({
      productId: postProduct.id,
      vegetableKey: normalizeVegetableName(productName),
      startedAt: now,
      originalQty: body.productQty.toString(),
    });
    return postProduct;
  });
}

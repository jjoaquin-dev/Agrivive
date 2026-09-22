import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, sellers_product } from "../../../db/schema";
import { priceToCents } from "../../../utils/order-amount";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { normalizeVegetableName } from "../../../utils/vegetable-identity";

export function reactivateSellerProduct(sellerId: string, productId: string) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${sellerId}), 3)`);
    await requireVerifiedSeller(tx, sellerId);
    const [product] = await tx.select().from(sellers_product).where(and(
      eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId),
    )).for("update").limit(1);
    if (!product) throw new OrderError(404, "Product not found");
    if (product.isActive) return product;
    if (!product.productQty || Number(product.productQty) <= 0 ||
      !product.productPrice || priceToCents(Number(product.productPrice)) === null ||
      !product.isMarketable) {
      throw new OrderError(409, "Product needs stock, a valid price, and marketability before reactivation");
    }

    const now = new Date();
    const [updated] = await tx.update(sellers_product).set({
      isActive: true,
      originalQty: product.productQty,
      publishedAt: now,
      updatedAt: now,
    }).where(eq(sellers_product.id, productId)).returning();
    await tx.insert(listing_cycles).values({
      productId,
      vegetableKey: normalizeVegetableName(product.productName),
      startedAt: now,
      originalQty: product.productQty,
    });
    return updated;
  });
}

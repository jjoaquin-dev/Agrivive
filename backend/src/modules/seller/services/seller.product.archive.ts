import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export function archiveSellerProduct(sellerId: string, productId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [current] = await tx.select().from(sellers_product).where(and(
      eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId),
    )).for("update").limit(1);
    if (!current) throw new OrderError(404, "Product not found");
    if (!current.isActive) return current;
    const [product] = await tx.update(sellers_product)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(sellers_product.id, productId))
      .returning();
    return product;
  });
}

import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { ordered_items, orders, sellers_product } from "../../../db/schema";
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

    const [activeReservation] = await tx
      .select({ orderId: orders.id })
      .from(ordered_items)
      .innerJoin(orders, eq(orders.id, ordered_items.ordersId))
      .where(
        and(
          eq(ordered_items.productId, productId),
          eq(orders.status, "pending"),
        ),
      )
      .limit(1);

    if (activeReservation) {
      throw new OrderError(
        409,
        "Cannot archive this produce because it is currently reserved by a buyer. Please complete or cancel the pickup first.",
      );
    }

    const [product] = await tx.update(sellers_product)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(sellers_product.id, productId))
      .returning();
    return product;
  });
}


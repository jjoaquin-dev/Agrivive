import { eq, sql } from "drizzle-orm";
import { ordered_items, sellers_product } from "../../db/schema";
import type { OrderTransaction } from "../order-types";

export async function restoreOrderStock(tx: OrderTransaction, orderId: string) {
  const items = await tx
    .select({ productId: ordered_items.productId, quantity: ordered_items.quantity })
    .from(ordered_items)
    .where(eq(ordered_items.ordersId, orderId));
  if (!items.length || items.some((item) => item.quantity === null)) {
    throw new Error("Order items are missing a quantity");
  }
  for (const item of items) {
    const [updated] = await tx
      .update(sellers_product)
      .set({ productQty: sql`${sellers_product.productQty} + ${item.quantity}` })
      .where(eq(sellers_product.id, item.productId))
      .returning({ id: sellers_product.id });
    if (!updated) throw new Error("Order product is missing");
  }
}

import { and, eq, gt } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";
import { restoreOrderStock } from "../../../utils/order-stock";
import { OrderError } from "../../../utils/order-types";
import { getBuyerOrder } from "./buyer.order.get";

export async function cancelBuyerOrder(orderId: string, buyerId: string) {
  await db.transaction(async (tx) => {
    const now = new Date();
    const [cancelled] = await tx
      .update(orders)
      .set({ status: "cancelled", cancelledBy: "buyer", updatedAt: now })
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.buyersId, buyerId),
          eq(orders.status, "pending"),
          gt(orders.expiresAt, now),
        ),
      )
      .returning({ id: orders.id });
    if (!cancelled) {
      const [current] = await tx
        .select({ status: orders.status, expiresAt: orders.expiresAt })
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.buyersId, buyerId)))
        .limit(1);
      if (!current) throw new OrderError(404, "Order not found");
      if (current.status === "pending" && current.expiresAt && current.expiresAt <= now) {
        throw new OrderError(410, "Order has expired");
      }
      throw new OrderError(409, "Order is no longer pending");
    }
    await restoreOrderStock(tx, cancelled.id);
  });
  return getBuyerOrder(orderId, buyerId);
}

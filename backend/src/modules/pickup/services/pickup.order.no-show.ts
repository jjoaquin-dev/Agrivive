import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_declines, orders } from "../../../db/schema";
import { getOrder } from "../../../utils/order-read";
import { OrderError } from "../../../utils/order-types";
import { recordNoShow } from "../../../utils/pickup/no-show";
import { expireOrderRow } from "../../../utils/pickup/expire-order";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";

/** The seller marks a buyer who never came. Only after the slot and the 15 extra QR minutes are over. */
export async function markOrderNoShow(sellerId: string, orderId: string) {
  const outcome = await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).for("update").limit(1);
    if (!order) throw new OrderError(404, "Order not found");
    if (order.sellersId !== sellerId) throw new OrderError(403, "This order belongs to another seller");
    if (!order.pickupEnd || !order.expiresAt) throw new OrderError(409, "This order has no pickup time");
    if (order.status === "completed" || order.status === "cancelled" || order.status === "declined") throw new OrderError(409, "This order is already closed");
    if (order.noShowAt) throw new OrderError(409, "This no-show was already recorded");
    if (order.expiresAt > new Date()) throw new OrderError(409, "You can mark a no-show only after the pickup time and the QR time are over");
    const [decline] = await tx.select({ id: order_declines.id }).from(order_declines).where(eq(order_declines.orderId, orderId)).limit(1);
    if (decline) throw new OrderError(409, "This buyer came and declined at pickup, so it is not a no-show");
    if (order.status === "pending") await expireOrderRow(tx, orderId);
    return recordNoShow(tx, { orderId, buyerId: order.buyersId, markedBy: sellerId });
  });
  if (outcome) {
    const [order] = await db.select({ buyerId: orders.buyersId }).from(orders).where(eq(orders.id, orderId)).limit(1);
    await evaluateTrustAction(order!.buyerId, orderId, outcome.eventKey, "buyer_failed_reservation");
  }
  return getOrder(orderId, sellerId, "seller");
}

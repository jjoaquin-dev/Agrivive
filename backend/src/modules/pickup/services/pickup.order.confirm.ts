import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { order_status_history, orders } from "../../../db/schema";
import { getOrder } from "../../../utils/order-read";
import { OrderError, type OrderTransaction } from "../../../utils/order-types";
import { notifyBuyer, notifySeller } from "../../../utils/pickup/notify";

/**
 * One atomic update confirms an order. The seller's tap and the 3-hour automatic rule both go through it,
 * and both require "not confirmed yet", so they can never both succeed or run twice.
 */
export async function confirmOrderRow(tx: OrderTransaction, orderId: string, mode: "manual" | "auto", sellerId?: string) {
  const now = new Date();
  const [row] = await tx.update(orders).set({ confirmedAt: now, confirmationMode: mode, updatedAt: now }).where(and(
    eq(orders.id, orderId), eq(orders.status, "pending"), isNull(orders.confirmedAt), gt(orders.expiresAt, now),
    sellerId ? eq(orders.sellersId, sellerId) : undefined,
  )).returning({ id: orders.id, buyersId: orders.buyersId, sellersId: orders.sellersId });
  if (!row) return null;
  await tx.insert(order_status_history).values({ orderId, status: "confirmed", actorId: mode === "manual" ? sellerId : null, note: mode === "auto" ? "Confirmed automatically after 3 hours" : "Confirmed by the seller" });
  await notifyBuyer(tx, {
    buyerId: row.buyersId, orderId, key: `order-confirmed:${orderId}`,
    message: mode === "auto"
      ? "The seller did not answer in 3 hours, so your order was confirmed automatically. You can no longer cancel it. Please come at your pickup time."
      : "The seller confirmed your order. You can no longer cancel it. Please come at your pickup time.",
  });
  if (mode === "auto") {
    await notifySeller(tx, { sellerId: row.sellersId, orderId, key: `order-auto-confirmed:${orderId}`, message: "You did not confirm this order in 3 hours, so it was confirmed for you. Please prepare it for the pickup time." });
  }
  return row;
}

export async function confirmSellerOrder(sellerId: string, orderId: string) {
  const confirmed = await db.transaction((tx) => confirmOrderRow(tx, orderId, "manual", sellerId));
  if (!confirmed) {
    const [current] = await db.select({ sellerId: orders.sellersId, status: orders.status, confirmedAt: orders.confirmedAt }).from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!current) throw new OrderError(404, "Order not found");
    if (current.sellerId !== sellerId) throw new OrderError(403, "This order belongs to another seller");
    if (current.confirmedAt) throw new OrderError(409, "This order is already confirmed");
    throw new OrderError(409, "This order can no longer be confirmed");
  }
  return getOrder(orderId, sellerId, "seller");
}

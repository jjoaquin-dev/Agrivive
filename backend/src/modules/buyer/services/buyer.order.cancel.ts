import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { order_status_history, orders } from "../../../db/schema";
import { restoreOrderStock } from "../../../utils/order-stock";
import { OrderError } from "../../../utils/order-types";
import { notifySeller } from "../../../utils/pickup/notify";
import { isLateCancellation } from "../../../utils/pickup/qr-window";
import { recordTrustEvent } from "../../../utils/trust";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";
import { getBuyerOrder } from "./buyer.order.get";

export const CANCEL_AFTER_CONFIRM_MESSAGE = "This order has already been confirmed by the seller. Buyer cancellation is no longer available.";

/** A buyer can cancel only until the seller (or the 3-hour rule) confirms the order. Inside 3 hours of pickup it costs 1 point. */
export async function cancelBuyerOrder(orderId: string, buyerId: string) {
  const late = await db.transaction(async (tx) => {
    const now = new Date();
    const [cancelled] = await tx
      .update(orders)
      .set({ status: "cancelled", cancelledBy: "buyer", cancelledAt: now, updatedAt: now })
      .where(and(
        eq(orders.id, orderId), eq(orders.buyersId, buyerId), eq(orders.status, "pending"),
        isNull(orders.confirmedAt), gt(orders.expiresAt, now),
      ))
      .returning({ id: orders.id, sellersId: orders.sellersId, pickupEnd: orders.pickupEnd });

    if (!cancelled) {
      const [current] = await tx.select({ status: orders.status, expiresAt: orders.expiresAt, confirmedAt: orders.confirmedAt })
        .from(orders).where(and(eq(orders.id, orderId), eq(orders.buyersId, buyerId))).limit(1);
      if (!current) throw new OrderError(404, "Order not found");
      if (current.status === "pending" && current.confirmedAt) throw new OrderError(409, CANCEL_AFTER_CONFIRM_MESSAGE);
      if (current.status === "pending" && current.expiresAt && current.expiresAt <= now) throw new OrderError(410, "Order has expired");
      throw new OrderError(409, "Order is no longer pending");
    }

    await restoreOrderStock(tx, cancelled.id);
    await tx.insert(order_status_history).values({ orderId, status: "cancelled", actorId: buyerId, note: "Cancelled by the buyer before confirmation" });
    await notifySeller(tx, {
      sellerId: cancelled.sellersId, orderId, key: `buyer-cancelled:${orderId}`,
      message: "The buyer cancelled before you confirmed. The stock and the pickup time were released.",
    });
    if (!isLateCancellation(cancelled.pickupEnd, now)) return null;
    const eventKey = `buyer-late-cancel:${orderId}`;
    await recordTrustEvent(tx, { eventKey, orderId, subjectId: buyerId, kind: "buyer_late_cancellation", classification: "verified", sourceId: orderId });
    return eventKey;
  });
  if (late) await evaluateTrustAction(buyerId, orderId, late, "buyer_late_cancellation");
  return getBuyerOrder(orderId, buyerId);
}

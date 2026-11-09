import { and, eq, gt } from "drizzle-orm";
import { db } from "../../../db";
import { order_status_history, orders } from "../../../db/schema";
import { restoreOrderStock } from "../../../utils/order-stock";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";
import { queueTrustNotice, recordTrustEvent } from "../../../utils/trust";
import { getOrder } from "../../../utils/order-read";

export async function cancelSellerOrder(sellerId: string, orderId: string, reason: string) {
  if (reason.trim().length < 5) throw new OrderError(400, "Cancellation reason is required");
  await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const now = new Date();
    const [cancelled] = await tx.update(orders).set({
      status: "cancelled", cancelledBy: "seller", cancellationReason: reason.trim(), cancelledAt: now, updatedAt: now,
    }).where(and(
      eq(orders.id, orderId), eq(orders.sellersId, sellerId),
      eq(orders.status, "pending"), gt(orders.expiresAt, now),
    )).returning({ id: orders.id, buyerId: orders.buyersId, confirmedAt: orders.confirmedAt });
    if (!cancelled) {
      const [current] = await tx.select({ sellerId: orders.sellersId, status: orders.status, expiresAt: orders.expiresAt })
        .from(orders).where(eq(orders.id, orderId)).limit(1);
      if (!current) throw new OrderError(404, "Order not found");
      if (current.sellerId !== sellerId) throw new OrderError(403, "This order belongs to another seller");
      if (current.status === "pending" && current.expiresAt && current.expiresAt <= now) throw new OrderError(410, "Order has expired");
      throw new OrderError(409, "Order is no longer pending");
    }
    await restoreOrderStock(tx, cancelled.id);
    await tx.insert(order_status_history).values({ orderId, status: "cancelled", actorId: sellerId, note: "Cancelled by the seller" });
    // Only cancelling an order the seller confirmed (or that was confirmed for them) adds points. Declining an unconfirmed request does not.
    if (cancelled.confirmedAt) {
      await recordTrustEvent(tx, { eventKey: `seller-cancel:${orderId}`, orderId, subjectId: sellerId,
        kind: "seller_cancellation", classification: "verified" });
    }
    await queueTrustNotice(tx, { noticeKey: `seller-cancel-buyer:${orderId}`, recipientId: cancelled.buyerId,
      orderId, kind: "seller_cancellation_buyer" });
  });
  await evaluateTrustAction(sellerId, orderId, `seller-cancel:${orderId}`, "seller_cancellation");
  return getOrder(orderId, sellerId, "seller");
}

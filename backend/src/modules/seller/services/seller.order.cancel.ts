import { and, eq, gt } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";
import { restoreOrderStock } from "../../../utils/order-stock";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { queueTrustNotice, recordTrustEvent } from "../../../utils/trust";
import { getOrder } from "../../../utils/order-read";

export async function cancelSellerOrder(sellerId: string, orderId: string, reason: string) {
  if (reason.trim().length < 5) throw new OrderError(400, "Cancellation reason is required");
  await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const now = new Date();
    const [cancelled] = await tx.update(orders).set({
      status: "cancelled", cancelledBy: "seller", cancellationReason: reason.trim(), updatedAt: now,
    }).where(and(
      eq(orders.id, orderId), eq(orders.sellersId, sellerId),
      eq(orders.status, "pending"), gt(orders.expiresAt, now),
    )).returning({ id: orders.id, buyerId: orders.buyersId });
    if (!cancelled) {
      const [current] = await tx.select({ sellerId: orders.sellersId, status: orders.status, expiresAt: orders.expiresAt })
        .from(orders).where(eq(orders.id, orderId)).limit(1);
      if (!current) throw new OrderError(404, "Order not found");
      if (current.sellerId !== sellerId) throw new OrderError(403, "This order belongs to another seller");
      if (current.status === "pending" && current.expiresAt && current.expiresAt <= now) throw new OrderError(410, "Order has expired");
      throw new OrderError(409, "Order is no longer pending");
    }
    await restoreOrderStock(tx, cancelled.id);
    await recordTrustEvent(tx, { eventKey: `seller-cancel:${orderId}`, orderId, subjectId: sellerId,
      kind: "seller_cancellation", classification: "verified" });
    await queueTrustNotice(tx, { noticeKey: `seller-cancel-warning:${orderId}`, recipientId: sellerId,
      orderId, kind: "seller_cancellation_warning" });
    await queueTrustNotice(tx, { noticeKey: `seller-cancel-buyer:${orderId}`, recipientId: cancelled.buyerId,
      orderId, kind: "seller_cancellation_buyer" });
  });
  return getOrder(orderId, sellerId, "seller");
}

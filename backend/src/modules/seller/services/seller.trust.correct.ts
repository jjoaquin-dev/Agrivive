import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_inquiries, orders, trust_corrections, trust_events } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { queueTrustNotice } from "../../../utils/trust";

export function correctSellerTrustEvent(sellerId: string, eventId: string, reason: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [event] = await tx.select().from(trust_events).where(and(
      eq(trust_events.id, eventId), eq(trust_events.subjectId, sellerId),
      eq(trust_events.classification, "verified"),
    )).for("update").limit(1);
    if (!event) throw new OrderError(404, "Trust event not found");
    let valid = true;
    if (event.kind === "seller_cancellation") {
      const [order] = await tx.select({ status: orders.status, cancelledBy: orders.cancelledBy })
        .from(orders).where(eq(orders.id, event.orderId)).limit(1);
      valid = order?.status === "cancelled" && order.cancelledBy === "seller";
    } else if (event.kind === "inquiry_non_response" && event.sourceId) {
      const [inquiry] = await tx.select().from(order_inquiries)
        .where(eq(order_inquiries.id, event.sourceId)).limit(1);
      valid = !!inquiry && inquiry.orderId === event.orderId &&
        (!inquiry.repliedAt || inquiry.repliedAt.getTime() - inquiry.createdAt.getTime() >= 48 * 3_600_000);
    } else {
      throw new OrderError(400, "This event cannot be corrected automatically");
    }
    const [correction] = await tx.insert(trust_corrections).values({
      eventId, requesterId: sellerId, reason: reason.trim(), outcome: valid ? "confirmed" : "invalidated",
    }).onConflictDoNothing({ target: trust_corrections.eventId }).returning();
    if (!correction) throw new OrderError(409, "A correction was already requested");
    if (!valid) {
      await tx.update(trust_events).set({ invalidatedAt: new Date() })
        .where(eq(trust_events.id, eventId));
      await queueTrustNotice(tx, { noticeKey: `trust-corrected:${eventId}`, recipientId: sellerId,
        orderId: event.orderId, kind: "trust_event_corrected" });
    }
    return correction;
  });
}

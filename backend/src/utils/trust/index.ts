import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { order_inquiries, orders, trust_events, trust_notices } from "../../db/schema";
import { OrderError, type OrderSide } from "../order-types";
import type { OrderTransaction } from "../order-types";

export function recordTrustEvent(tx: OrderTransaction, input: {
  eventKey: string;
  orderId: string;
  subjectId: string;
  kind: string;
  classification: "verified" | "allegation";
  sourceId?: string;
}) {
  return tx.insert(trust_events).values(input).onConflictDoNothing({ target: trust_events.eventKey }).returning();
}

export function queueTrustNotice(tx: OrderTransaction, input: {
  noticeKey: string;
  recipientId: string;
  orderId: string;
  kind: string;
}) {
  return tx.insert(trust_notices).values(input).onConflictDoNothing({ target: trust_notices.noticeKey }).returning();
}

export async function recordInquiryDeadlines(tx: OrderTransaction, inquiry: {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  createdAt: Date;
}, now: Date) {
  const hours = (now.getTime() - inquiry.createdAt.getTime()) / 3_600_000;
  if (hours >= 12) await queueTrustNotice(tx, {
    noticeKey: `inquiry-reminder:${inquiry.id}`, recipientId: inquiry.sellerId,
    orderId: inquiry.orderId, kind: "inquiry_12h_reminder",
  });
  if (hours >= 24) {
    await queueTrustNotice(tx, {
      noticeKey: `inquiry-warning:${inquiry.id}`, recipientId: inquiry.sellerId,
      orderId: inquiry.orderId, kind: "inquiry_24h_warning",
    });
    await queueTrustNotice(tx, {
      noticeKey: `inquiry-buyer:${inquiry.id}`, recipientId: inquiry.buyerId,
      orderId: inquiry.orderId, kind: "inquiry_24h_buyer_notice",
    });
  }
  if (hours >= 48) await recordTrustEvent(tx, {
    eventKey: `inquiry-unanswered:${inquiry.id}`, orderId: inquiry.orderId,
    subjectId: inquiry.sellerId, kind: "inquiry_non_response",
    classification: "verified", sourceId: inquiry.id,
  });
}

export async function listOrderInquiries(userId: string, orderId: string, side: OrderSide) {
  const owner = side === "buyer" ? orders.buyersId : orders.sellersId;
  const [order] = await db.select({ id: orders.id }).from(orders)
    .where(and(eq(orders.id, orderId), eq(owner, userId))).limit(1);
  if (!order) throw new OrderError(404, "Order not found");
  return db.select().from(order_inquiries).where(eq(order_inquiries.orderId, orderId));
}

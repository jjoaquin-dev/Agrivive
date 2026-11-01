import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { order_inquiries, orders, trust_events, trust_notices } from "../../db/schema";
import { OrderError, type OrderSide } from "../order-types";
import type { OrderTransaction } from "../order-types";
import { alertSellerOfTrustNotice } from "../seller-notifications";

export function recordTrustEvent(tx: OrderTransaction, input: {
  eventKey: string;
  orderId?: string | null;
  subjectId: string;
  kind: string;
  classification: "verified" | "allegation";
  sourceId?: string;
}) {
  return tx.insert(trust_events).values(input).onConflictDoNothing({ target: trust_events.eventKey }).returning();
}

export async function queueTrustNotice(tx: OrderTransaction, input: {
  noticeKey: string;
  recipientId: string;
  orderId?: string | null;
  kind: string;
}) {
  const rows = await tx.insert(trust_notices).values(input)
    .onConflictDoNothing({ target: trust_notices.noticeKey }).returning();
  if (rows.length) await alertSellerOfTrustNotice(tx, input);
  return rows;
}

export async function listOrderInquiries(userId: string, orderId: string, side: OrderSide) {
  const owner = side === "buyer" ? orders.buyersId : orders.sellersId;
  const [order] = await db.select({ id: orders.id }).from(orders)
    .where(and(eq(orders.id, orderId), eq(owner, userId))).limit(1);
  if (!order) throw new OrderError(404, "Order not found");
  return db.select().from(order_inquiries).where(eq(order_inquiries.orderId, orderId));
}

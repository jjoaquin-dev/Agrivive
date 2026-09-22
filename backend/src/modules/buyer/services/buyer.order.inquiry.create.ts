import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_inquiries, orders } from "../../../db/schema";
import { requireActiveUser } from "../../../utils/order-access";
import { OrderError } from "../../../utils/order-types";

export function createBuyerInquiry(buyerId: string, orderId: string, question: string) {
  if (!question.trim()) throw new OrderError(400, "Question is required");
  return db.transaction(async (tx) => {
    await requireActiveUser(tx, buyerId, "buyer");
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${orderId}), 2)`);
    const [order] = await tx.select().from(orders).where(and(
      eq(orders.id, orderId), eq(orders.buyersId, buyerId),
    )).limit(1);
    if (!order) throw new OrderError(404, "Order not found");
    if (order.status !== "pending" || !order.expiresAt || order.expiresAt <= new Date()) {
      throw new OrderError(409, "Only active orders accept new inquiries");
    }
    const [open] = await tx.select({ id: order_inquiries.id }).from(order_inquiries).where(and(
      eq(order_inquiries.orderId, orderId), isNull(order_inquiries.repliedAt),
    )).limit(1);
    if (open) throw new OrderError(409, "An inquiry is already awaiting a reply");
    const [inquiry] = await tx.insert(order_inquiries).values({
      orderId, buyerId, sellerId: order.sellersId, question: question.trim(),
    }).returning();
    return inquiry;
  });
}

import { and, eq, gt, ne } from "drizzle-orm";
import { db } from "../../../db";
import { order_excuses, orders } from "../../../db/schema";
import { getOrder } from "../../../utils/order-read";
import { OrderError } from "../../../utils/order-types";
import { notifySeller } from "../../../utils/pickup/notify";
import type { ExcuseBody } from "../model/pickup.excuse";

export const EXCUSE_WINDOW_HOURS = 24;
export const EXCUSE_LIMIT_DAYS = 30;

/** "I had a problem": 24 hours after an expired reservation, once per 30 days. The seller confirms it. */
export async function createOrderExcuse(buyerId: string, orderId: string, body: ExcuseBody) {
  if (body.reason === "other" && (body.details?.trim().length ?? 0) < 5) {
    throw new OrderError(400, "Please tell us what happened.");
  }
  await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.buyersId, buyerId))).for("update").limit(1);
    if (!order) throw new OrderError(404, "Order not found");
    if (order.status !== "expired" || !order.expiredAt) throw new OrderError(409, "You can only explain a reservation that expired.");
    if (Date.now() - order.expiredAt.getTime() > EXCUSE_WINDOW_HOURS * 3_600_000) {
      throw new OrderError(410, "The 24 hours to explain this have passed.");
    }
    const [recent] = await tx.select({ id: order_excuses.id }).from(order_excuses).where(and(
      eq(order_excuses.buyerId, buyerId), ne(order_excuses.orderId, orderId),
      gt(order_excuses.createdAt, new Date(Date.now() - EXCUSE_LIMIT_DAYS * 86_400_000)))).limit(1);
    if (recent) throw new OrderError(409, "You can explain one missed pickup every 30 days.");
    const [created] = await tx.insert(order_excuses).values({ orderId, buyerId, reason: body.reason, details: body.details?.trim() ?? null })
      .onConflictDoNothing({ target: order_excuses.orderId }).returning();
    if (!created) throw new OrderError(409, "You already sent an explanation for this order.");
    await notifySeller(tx, { sellerId: order.sellersId, orderId, key: `excuse-sent:${orderId}`, message: "The buyer says a problem stopped the pickup. Please confirm or reject the explanation." });
  });
  return getOrder(orderId, buyerId, "buyer");
}

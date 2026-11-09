import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { buyer_no_shows, order_excuses, orders, trust_events } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { notifyBuyer } from "../../../utils/pickup/notify";
import { recalculateTrustStanding } from "../../../utils/trust/recalculate";

/**
 * The order's seller confirms or rejects a buyer's excuse. A confirmed excuse removes the event
 * (0 points) and the level is recalculated. A rejected one leaves the no-show rule as it was.
 */
export async function decideOrderExcuse(sellerId: string, orderId: string, accept: boolean) {
  const buyerId = await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) throw new OrderError(404, "Order not found");
    if (order.sellersId !== sellerId) throw new OrderError(403, "This order belongs to another seller");
    const [excuse] = await tx.select().from(order_excuses).where(eq(order_excuses.orderId, orderId)).for("update").limit(1);
    if (!excuse) throw new OrderError(404, "There is no explanation for this order");
    if (excuse.status !== "pending") throw new OrderError(409, "This explanation was already decided");
    await tx.update(order_excuses).set({ status: accept ? "confirmed" : "rejected", decidedBy: sellerId, decidedAt: new Date() }).where(eq(order_excuses.id, excuse.id));
    if (accept) {
      await tx.update(buyer_no_shows).set({ excused: true }).where(eq(buyer_no_shows.orderId, orderId));
      await tx.update(trust_events).set({ invalidatedAt: new Date() }).where(and(eq(trust_events.eventKey, `buyer-expired:${orderId}`), eq(trust_events.subjectId, order.buyersId)));
    }
    await notifyBuyer(tx, {
      buyerId: order.buyersId, orderId, key: `excuse-decided:${orderId}`,
      message: accept
        ? "Your explanation was accepted. This missed pickup adds 0 points to your score."
        : "Your explanation was not accepted, so the missed pickup rule still applies. If you think this is wrong, you can dispute the event within 7 days.",
    });
    return order.buyersId;
  });
  if (accept) await recalculateTrustStanding(buyerId, "Your explanation was accepted");
  return { status: accept ? "confirmed" : "rejected" };
}

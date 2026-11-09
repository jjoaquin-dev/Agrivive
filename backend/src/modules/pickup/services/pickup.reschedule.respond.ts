import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_reschedules, order_status_history, orders } from "../../../db/schema";
import { getOrder } from "../../../utils/order-read";
import { OrderError } from "../../../utils/order-types";
import { assertPickupAvailable } from "../../../utils/pickup/availability";
import { notifySeller } from "../../../utils/pickup/notify";
import { qrWindow } from "../../../utils/pickup/qr-window";

/** The buyer accepts or rejects the proposed time. Accepting moves the pickup and the QR window; the old window stops working. */
export async function respondToReschedule(buyerId: string, orderId: string, accept: boolean) {
  await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.buyersId, buyerId))).for("update").limit(1);
    if (!order) throw new OrderError(404, "Order not found");
    const [proposal] = await tx.select().from(order_reschedules).where(and(eq(order_reschedules.orderId, orderId), eq(order_reschedules.status, "pending"))).for("update").limit(1);
    if (!proposal || order.status !== "pending") throw new OrderError(409, "There is no new time waiting for your answer");
    const now = new Date();
    if (!accept) {
      await tx.update(order_reschedules).set({ status: "rejected", respondedAt: now }).where(eq(order_reschedules.id, proposal.id));
      await notifySeller(tx, { sellerId: order.sellersId, orderId, key: `reschedule-rejected:${proposal.id}`, message: "The buyer kept the original pickup time." });
      return;
    }
    await assertPickupAvailable(tx, { buyerId, sellerId: order.sellersId, range: { start: proposal.newStart, end: proposal.newEnd }, excludeOrderId: orderId });
    await tx.update(orders).set({
      pickupStart: proposal.newStart, pickupEnd: proposal.newEnd, expiresAt: qrWindow(proposal.newStart, proposal.newEnd).validUntil, updatedAt: now,
    }).where(eq(orders.id, orderId));
    await tx.update(order_reschedules).set({ status: "accepted", respondedAt: now }).where(eq(order_reschedules.id, proposal.id));
    await tx.insert(order_status_history).values({ orderId, status: "rescheduled", actorId: buyerId, note: `Moved from ${proposal.oldStart.toISOString()} to ${proposal.newStart.toISOString()}` });
    await notifySeller(tx, { sellerId: order.sellersId, orderId, key: `reschedule-accepted:${proposal.id}`, message: "The buyer accepted the new pickup time. The QR now works for the new time." });
  });
  return getOrder(orderId, buyerId, "buyer");
}

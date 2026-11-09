import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_reschedules, orders } from "../../../db/schema";
import { getOrder } from "../../../utils/order-read";
import { OrderError } from "../../../utils/order-types";
import { assertPickupAvailable } from "../../../utils/pickup/availability";
import { formatManilaTime, manilaDateKey } from "../../../utils/pickup/manila";
import { notifyBuyer } from "../../../utils/pickup/notify";
import type { RescheduleProposeBody } from "../model/pickup.reschedule";

/** The seller offers a new date and time with a reason. Nothing changes until the buyer accepts. */
export async function proposeReschedule(sellerId: string, orderId: string, body: RescheduleProposeBody) {
  const range = { start: new Date(body.pickupStart), end: new Date(body.pickupEnd) };
  await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.sellersId, sellerId))).for("update").limit(1);
    if (!order) throw new OrderError(404, "Order not found");
    if (order.status !== "pending" || !order.pickupStart || !order.pickupEnd) throw new OrderError(409, "Only an open reservation can be moved");
    await assertPickupAvailable(tx, { buyerId: order.buyersId, sellerId, range, excludeOrderId: orderId });
    try {
      await tx.insert(order_reschedules).values({
        orderId, proposedBy: sellerId, reason: body.reason.trim(),
        oldStart: order.pickupStart, oldEnd: order.pickupEnd, newStart: range.start, newEnd: range.end,
      });
    } catch {
      throw new OrderError(409, "A new time is already waiting for the buyer's answer.");
    }
    await notifyBuyer(tx, {
      buyerId: order.buyersId, orderId, key: `reschedule-asked:${orderId}:${range.start.getTime()}`,
      message: `The seller asks to move your pickup to ${manilaDateKey(range.start)}, ${formatManilaTime(range.start)} to ${formatManilaTime(range.end)}. Reason: ${body.reason.trim()}. Your pickup stays as it is until you accept.`,
    });
  });
  return getOrder(orderId, sellerId, "seller");
}

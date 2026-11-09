import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { order_status_history, orders } from "../../../db/schema";
import { getOrder } from "../../../utils/order-read";
import { OrderError } from "../../../utils/order-types";
import { notifyBuyer } from "../../../utils/pickup/notify";

/** Seller steps after confirming: "packed" (preparing), then "ready". "Ready" is not "completed": only a valid QR scan completes. */
export async function advanceSellerOrder(sellerId: string, orderId: string, step: "packed" | "ready") {
  const now = new Date();
  const changes = step === "packed" ? { packedAt: now } : { readyAt: now };
  const [row] = await db.update(orders).set({ ...changes, updatedAt: now }).where(and(
    eq(orders.id, orderId), eq(orders.sellersId, sellerId), eq(orders.status, "pending"), isNotNull(orders.confirmedAt),
    step === "packed" ? isNull(orders.packedAt) : isNull(orders.readyAt),
  )).returning({ buyersId: orders.buyersId });
  if (!row) {
    const [current] = await db.select({ sellerId: orders.sellersId, status: orders.status, confirmedAt: orders.confirmedAt }).from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!current) throw new OrderError(404, "Order not found");
    if (current.sellerId !== sellerId) throw new OrderError(403, "This order belongs to another seller");
    if (!current.confirmedAt) throw new OrderError(409, "Confirm the order first");
    throw new OrderError(409, "This order cannot move to that step");
  }
  await db.transaction(async (tx) => {
    await tx.insert(order_status_history).values({ orderId, status: step === "packed" ? "preparing" : "ready", actorId: sellerId });
    if (step === "ready") await notifyBuyer(tx, { buyerId: row.buyersId, orderId, key: `order-ready:${orderId}`, message: "Your order is ready for pickup. Please look over your items when you pick up." });
  });
  return getOrder(orderId, sellerId, "seller");
}

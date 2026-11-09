import { and, eq } from "drizzle-orm";
import { order_reschedules, order_status_history, orders } from "../../db/schema";
import { restoreOrderStock } from "../order-stock";
import type { OrderTransaction } from "../order-types";
import { createSellerNotification } from "../seller-notifications";
import { notifyBuyer } from "./notify";

/** Ends a reservation nobody picked up: frees the stock, the seller's pickup time, and tells both sides. No points yet; a no-show does that. */
export async function expireOrderRow(tx: OrderTransaction, orderId: string, now = new Date()) {
  const [updated] = await tx.update(orders).set({ status: "expired", expiredAt: now, updatedAt: now })
    .where(and(eq(orders.id, orderId), eq(orders.status, "pending")))
    .returning({ id: orders.id, buyersId: orders.buyersId, sellersId: orders.sellersId });
  if (!updated) return null;
  await restoreOrderStock(tx, updated.id);
  await tx.update(order_reschedules).set({ status: "withdrawn", respondedAt: now })
    .where(and(eq(order_reschedules.orderId, orderId), eq(order_reschedules.status, "pending")));
  await tx.insert(order_status_history).values({ orderId, status: "expired", note: "The pickup QR expired" });
  await notifyBuyer(tx, {
    buyerId: updated.buyersId, orderId, key: `qr-expired:${orderId}`,
    message: "Your pickup QR has expired and the order ended. If something came up, press \"I had a problem\" within 24 hours and tell us why. To buy again, place a new order.",
  });
  await createSellerNotification(tx, { sellerId: updated.sellersId, kind: "reservation_ended", dedupeKey: `reservation-ended:${orderId}`, orderId });
  return updated;
}

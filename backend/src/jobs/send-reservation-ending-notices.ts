import { and, asc, eq, gt, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { orders, seller_notifications } from "../db/schema";
import { createSellerNotification } from "../utils/seller-notifications";

const warningWindowMs = 30 * 60 * 1000;

/** Warns the seller once per reservation, only after pickup time has started and the QR is about to stop. */
export async function sendReservationEndingNotices(limit = 100) {
  const now = new Date();
  const due = await db.select({ id: orders.id, sellerId: orders.sellersId })
    .from(orders)
    .where(and(
      eq(orders.status, "pending"),
      gt(orders.expiresAt, now),
      sql`coalesce(${orders.pickupStart}, ${now.toISOString()}::timestamptz) <= ${now.toISOString()}::timestamptz`,
      lte(orders.expiresAt, new Date(now.getTime() + warningWindowMs)),
      sql`not exists (select 1 from ${seller_notifications} where ${seller_notifications.dedupeKey} = 'reservation-ending:' || ${orders.id}::text)`,
    ))
    .orderBy(asc(orders.expiresAt))
    .limit(limit);

  let created = 0;
  for (const order of due) {
    const row = await db.transaction((tx) => createSellerNotification(tx, {
      sellerId: order.sellerId,
      kind: "reservation_ending",
      dedupeKey: `reservation-ending:${order.id}`,
      orderId: order.id,
    }));
    if (row) created++;
  }
  return created;
}

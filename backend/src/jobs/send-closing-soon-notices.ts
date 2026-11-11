import { and, eq, gt } from "drizzle-orm";
import { db } from "../db";
import { orders, seller_opening_hours, sellers_profile } from "../db/schema";
import { is24Hours } from "../utils/pickup/rules";
import { manilaInstant, manilaParts } from "../utils/pickup/manila";
import { queueTrustNotice } from "../utils/trust";

const WARNING_MS = 30 * 60_000;

/** Tells buyers with a waiting reservation that the stall closes in 30 minutes. One notice per order per day; stalls open 24 hours never close, so they send none. */
export async function sendClosingSoonNotices(limit = 500) {
  const now = new Date();
  const today = manilaParts(now);
  const rows = await db.select({
    orderId: orders.id, buyerId: orders.buyersId, sellerId: orders.sellersId,
    opensMinute: seller_opening_hours.opensMinute, closesMinute: seller_opening_hours.closesMinute, closedDate: sellers_profile.closedDate,
  }).from(orders)
    .innerJoin(seller_opening_hours, and(eq(seller_opening_hours.sellerId, orders.sellersId), eq(seller_opening_hours.weekday, today.weekday), eq(seller_opening_hours.isClosed, false)))
    .innerJoin(sellers_profile, and(eq(sellers_profile.userId, orders.sellersId), eq(sellers_profile.isCurrent, true)))
    .where(and(eq(orders.status, "pending"), gt(orders.expiresAt, now))).limit(limit);

  let queued = 0;
  for (const row of rows) {
    if (is24Hours(row) || row.closedDate === today.dateKey) continue;
    const closesAt = manilaInstant(today.dateKey, row.closesMinute).getTime();
    if (now.getTime() < closesAt - WARNING_MS || now.getTime() >= closesAt) continue;
    const made = await db.transaction((tx) => queueTrustNotice(tx, {
      noticeKey: `closing-soon:${row.orderId}:${today.dateKey}`, recipientId: row.buyerId,
      orderId: row.orderId, kind: "pickup_closing_soon",
    }));
    if (made.length) queued++;
  }
  return queued;
}

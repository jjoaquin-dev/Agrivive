import { and, eq, isNotNull, isNull, lte, notExists } from "drizzle-orm";
import { db } from "../../../db";
import { order_declines, orders } from "../../../db/schema";
import { recordNoShow } from "../../../utils/pickup/no-show";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";

const SELLER_MARK_WINDOW_MS = 3_600_000;

/** Scheduled: if the seller did not mark an expired pickup within an hour, the system records the no-show. The buyer still has 24 hours to send an excuse. */
export async function recordUnmarkedNoShows(limit = 100) {
  const due = await db.select({ id: orders.id, buyerId: orders.buyersId }).from(orders).where(and(
    eq(orders.status, "expired"), isNotNull(orders.pickupStart), isNull(orders.noShowAt),
    lte(orders.expiredAt, new Date(Date.now() - SELLER_MARK_WINDOW_MS)),
    notExists(db.select({ one: order_declines.id }).from(order_declines).where(eq(order_declines.orderId, orders.id))),
  )).limit(limit);
  let recorded = 0;
  for (const row of due) {
    const outcome = await db.transaction((tx) => recordNoShow(tx, { orderId: row.id, buyerId: row.buyerId, markedBy: "system" }));
    if (!outcome) continue;
    recorded++;
    await evaluateTrustAction(row.buyerId, row.id, outcome.eventKey, "buyer_failed_reservation");
  }
  return recorded;
}

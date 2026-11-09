import { and, eq, gt, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { seller_away_periods, sellers_profile } from "../../db/schema";
import type { OrderTransaction } from "../order-types";

const MAX_AWAY_MS = 14 * 86_400_000;

/** How much of the time between `since` and `now` the seller was Away. That time does not count toward the 48-hour reply clock. */
export async function awayOverlapMs(tx: OrderTransaction, sellerId: string, since: Date, now: Date) {
  const periods = await tx.select().from(seller_away_periods).where(and(
    eq(seller_away_periods.sellerId, sellerId), lt(seller_away_periods.startedAt, now),
    or(isNull(seller_away_periods.endedAt), gt(seller_away_periods.endedAt, since)),
  ));
  let total = 0;
  for (const period of periods) {
    const end = Math.min(now.getTime(), (period.endedAt ?? new Date(period.startedAt.getTime() + MAX_AWAY_MS)).getTime());
    const start = Math.max(since.getTime(), period.startedAt.getTime());
    if (end > start) total += end - start;
  }
  return total;
}

/** Scheduled: an Away switch left on ends by itself after 14 days. */
export async function closeExpiredAway(now = new Date()) {
  const ended = await db.update(sellers_profile).set({ awayStartedAt: null, awayUntil: null, awayReason: null })
    .where(and(sql`${sellers_profile.awayUntil} is not null`, lt(sellers_profile.awayUntil, now))).returning({ id: sellers_profile.userId });
  if (ended.length) {
    await db.update(seller_away_periods).set({ endedAt: sql`${seller_away_periods.startedAt} + interval '14 days'` }).where(and(
      isNull(seller_away_periods.endedAt), lt(seller_away_periods.startedAt, new Date(now.getTime() - MAX_AWAY_MS))));
  }
  return ended.length;
}

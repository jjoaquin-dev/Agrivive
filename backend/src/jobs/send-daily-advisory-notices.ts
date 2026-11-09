import { and, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "../db";
import { sellers_profile, user } from "../db/schema";
import { getSellerAdvisories } from "../modules/seller/services/seller.advisories";
import { createSellerNotification } from "../utils/seller-notifications";
import { buildDailyAdvisorySummary } from "./daily-advisory-summary";

const sendFromHour = 6; // Philippine time
const skippedToday = new Set<string>(); // sellers with nothing to say today, so they are not asked every minute

/** Once a day, from 6 AM Philippine time, tells each seller today's weather and the next holiday. */
export async function sendDailyAdvisoryNotices(limit = 10) {
  const manila = new Date(Date.now() + 8 * 3600_000);
  if (manila.getUTCHours() < sendFromHour) return { due: 0, sent: 0 };
  const day = manila.toISOString().slice(0, 10);

  for (const key of skippedToday) if (!key.endsWith(`:${day}`)) skippedToday.delete(key);

  const due = await db.select({ sellerId: sellers_profile.userId }).from(sellers_profile)
    .innerJoin(user, eq(user.id, sellers_profile.userId))
    .where(and(
      eq(sellers_profile.isCurrent, true), isNotNull(sellers_profile.latitude), isNotNull(sellers_profile.longitude),
      eq(user.isActive, true),
      sql`not exists (select 1 from seller_notifications n where n.dedupe_key = 'daily-advisory:' || ${sellers_profile.userId} || ':' || ${day}::text)`,
    )).limit(100);

  let sent = 0;
  let tried = 0;
  for (const { sellerId } of due) {
    if (tried >= limit) break;
    const dedupeKey = `daily-advisory:${sellerId}:${day}`;
    if (skippedToday.has(dedupeKey)) continue;
    tried++;
    try {
      const summary = buildDailyAdvisorySummary(await getSellerAdvisories(sellerId));
      if (!summary) { skippedToday.add(dedupeKey); continue; }
      await db.transaction((tx) => createSellerNotification(tx, { sellerId, kind: "daily_advisory", dedupeKey, payload: { summary } }));
      sent++;
    } catch (error) {
      skippedToday.add(dedupeKey);
      console.error("Daily advisory notice failed", { sellerId, error });
    }
  }
  return { due: due.length, sent };
}

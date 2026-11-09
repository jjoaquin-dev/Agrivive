import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_opening_hours, sellers_profile } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { manilaDateKey } from "../../../utils/pickup/manila";

/** The seller's stall setup: weekly hours, Closed today, Away and pickup limits. */
export async function readStall(sellerId: string, now = new Date()) {
  const [profile] = await db.select().from(sellers_profile).where(eq(sellers_profile.userId, sellerId)).limit(1);
  if (!profile) throw new OrderError(404, "Seller stall not found");
  const hours = await db.select().from(seller_opening_hours).where(eq(seller_opening_hours.sellerId, sellerId));
  const away = !!profile.awayUntil && profile.awayUntil > now;
  return {
    shopName: profile.shopName,
    hours: [0, 1, 2, 3, 4, 5, 6].map((weekday) => {
      const row = hours.find((item) => item.weekday === weekday);
      return { weekday, isClosed: row?.isClosed ?? true, opensMinute: row?.opensMinute ?? 480, closesMinute: row?.closesMinute ?? 1200, configured: !!row };
    }),
    hoursConfigured: hours.length > 0,
    closedToday: profile.closedDate === manilaDateKey(now),
    pickupCapacity: profile.pickupCapacity,
    pickupWithinMinutes: profile.pickupWithinMinutes,
    away: { active: away, startedAt: away ? profile.awayStartedAt : null, until: away ? profile.awayUntil : null, reason: away ? profile.awayReason : null },
  };
}

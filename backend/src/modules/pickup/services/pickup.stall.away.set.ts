import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { seller_away_periods, sellers_profile } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import type { StallAwayBody } from "../model/pickup.stall";
import { readStall } from "./pickup.stall.read";

export const MAX_AWAY_DAYS = 14;

/**
 * Away tells buyers the seller cannot reply and stops the 48-hour reply clock. It does not touch orders, pickup
 * times or QR codes. One activation lasts at most 14 days.
 */
export async function setAway(sellerId: string, body: StallAwayBody) {
  const now = new Date();
  await db.transaction(async (tx) => {
    const [profile] = await tx.select().from(sellers_profile).where(eq(sellers_profile.userId, sellerId)).for("update").limit(1);
    if (!profile) throw new OrderError(404, "Seller stall not found");
    const active = !!profile.awayUntil && profile.awayUntil > now;
    if (body.away) {
      if (active) throw new OrderError(409, "Away mode is already on.");
      const days = Math.min(body.days ?? MAX_AWAY_DAYS, MAX_AWAY_DAYS);
      await tx.update(sellers_profile).set({
        awayStartedAt: now, awayUntil: new Date(now.getTime() + days * 86_400_000), awayReason: body.reason?.trim() || null,
      }).where(eq(sellers_profile.userId, sellerId));
      await tx.insert(seller_away_periods).values({ sellerId, startedAt: now, reason: body.reason?.trim() || null });
    } else {
      await tx.update(sellers_profile).set({ awayStartedAt: null, awayUntil: null, awayReason: null }).where(eq(sellers_profile.userId, sellerId));
      await tx.update(seller_away_periods).set({ endedAt: now }).where(and(eq(seller_away_periods.sellerId, sellerId), isNull(seller_away_periods.endedAt)));
    }
  });
  return readStall(sellerId);
}

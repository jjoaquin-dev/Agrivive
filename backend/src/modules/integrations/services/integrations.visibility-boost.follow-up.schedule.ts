import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";

export const followUpDelayMs = 6 * 3_600_000;

/**
 * Saves the due time for the 6-hour rule once the first post is out.
 * Only first boosts whose seller turned on price drops get one, and only once.
 * Never fails the post.
 */
export async function scheduleBoostFollowUp(boostId: string, firstPostAt: Date) {
  try {
    const [row] = await db.select({
      reason: seller_visibility_boosts.reason,
      percent: sellers_product.priceReductionPercent,
      minimumPrice: sellers_product.minimumPrice,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(eq(seller_visibility_boosts.id, boostId)).limit(1);
    if (!row || row.reason !== "initial" || Number(row.percent ?? 0) <= 0 || row.minimumPrice === null) return;

    await db.update(seller_visibility_boosts).set({
      followUpDueAt: new Date(firstPostAt.getTime() + followUpDelayMs),
    }).where(and(
      eq(seller_visibility_boosts.id, boostId),
      isNull(seller_visibility_boosts.followUpDueAt),
      sql`${seller_visibility_boosts.followUpAttempts} = 0`,
    ));
  } catch (error) {
    console.error("Boost follow-up schedule failed", { boostId, error });
  }
}

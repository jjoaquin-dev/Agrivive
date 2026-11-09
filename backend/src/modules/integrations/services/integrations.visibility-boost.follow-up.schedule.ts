import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";

export const followUpDelayMs = 6 * 3_600_000;

/**
 * Runs once when the first post is saved. A listing with auto-post on gets the 6-hour price drops:
 * with a drop amount and final price already set, the first drop is due 6 hours after the post; without them,
 * the seller is asked to set them at that time. Never fails the post.
 */
export async function scheduleBoostFollowUp(boostId: string, firstPostAt: Date) {
  try {
    const [row] = await db.select({
      reason: seller_visibility_boosts.reason,
      productId: seller_visibility_boosts.productId,
      amount: sellers_product.priceReductionAmount,
      minimumPrice: sellers_product.minimumPrice,
      enabled: sellers_product.priceReductionEnabled,
      autoPost: sellers_product.autoPostEnabled,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(eq(seller_visibility_boosts.id, boostId)).limit(1);
    // Follow-ups are automatic only for sellers who said yes to auto-post.
    if (!row || row.reason !== "initial" || !row.autoPost) return;

    const configured = row.enabled && Number(row.amount ?? 0) > 0 && row.minimumPrice !== null;
    const dueAt = new Date(firstPostAt.getTime() + followUpDelayMs);

    await db.update(seller_visibility_boosts).set({
      followUpDueAt: configured ? dueAt : null,
      priceDropSetupAt: configured ? null : dueAt,
    }).where(and(
      eq(seller_visibility_boosts.id, boostId),
      isNull(seller_visibility_boosts.priceDropSetupAt),
      isNull(seller_visibility_boosts.followUpDueAt),
      sql`${seller_visibility_boosts.followUpAttempts} = 0`,
    ));
  } catch (error) {
    console.error("Boost follow-up schedule failed", { boostId, error });
  }
}

import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { checkPriorityBoostGate } from "../../../utils/visibility-ranking/boost-gate";

export const followUpDelayMs = 6 * 3_600_000;

/**
 * Runs once when the first post is saved. AHP-TOPSIS decides here, while the listing is fresh, whether it is
 * Priority Boost, and the score and tier are saved on the boost. Only a Priority Boost listing gets the 6-hour price drops:
 * with a drop amount and final price already set, the first drop is due 6 hours after the post; without them,
 * the seller is asked to set them at that time. Any other listing keeps its normal post and nothing more.
 * Never fails the post.
 */
export async function scheduleBoostFollowUp(boostId: string, firstPostAt: Date) {
  try {
    const [row] = await db.select({
      reason: seller_visibility_boosts.reason,
      productId: seller_visibility_boosts.productId,
      amount: sellers_product.priceReductionAmount,
      minimumPrice: sellers_product.minimumPrice,
      enabled: sellers_product.priceReductionEnabled,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(eq(seller_visibility_boosts.id, boostId)).limit(1);
    if (!row || row.reason !== "initial") return;

    const gate = await checkPriorityBoostGate(row.productId);
    const priority = gate.allowed;
    const configured = row.enabled && Number(row.amount ?? 0) > 0 && row.minimumPrice !== null;
    const dueAt = new Date(firstPostAt.getTime() + followUpDelayMs);

    await db.update(seller_visibility_boosts).set({
      priorityScore: gate.score === null ? null : gate.score.toFixed(4),
      priorityTier: gate.tier ?? "Not Ranked",
      followUpDueAt: priority && configured ? dueAt : null,
      priceDropSetupAt: priority && !configured ? dueAt : null,
    }).where(and(
      eq(seller_visibility_boosts.id, boostId),
      isNull(seller_visibility_boosts.priorityTier),
      isNull(seller_visibility_boosts.followUpDueAt),
      sql`${seller_visibility_boosts.followUpAttempts} = 0`,
    ));
  } catch (error) {
    console.error("Boost follow-up schedule failed", { boostId, error });
  }
}

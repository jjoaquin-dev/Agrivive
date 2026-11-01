import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { followUpDelayMs } from "./integrations.visibility-boost.follow-up.schedule";

/**
 * Called after each 6-hour price cut and its post are saved. The rule listens again:
 * the next check is due in 6 hours, until the price reaches the seller's lowest price
 * (or the product is gone, or the seller paused price drops). Never fails the post.
 */
export async function rearmBoostFollowUp(boostId: string) {
  try {
    const [row] = await db.select({
      price: sellers_product.productPrice,
      minimumPrice: sellers_product.minimumPrice,
      enabled: sellers_product.priceReductionEnabled,
      amount: sellers_product.priceReductionAmount,
      quantity: sellers_product.productQty,
      active: sellers_product.isActive,
      marketable: sellers_product.isMarketable,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(eq(seller_visibility_boosts.id, boostId)).limit(1);
    if (!row) return;

    const canCutAgain = row.enabled && row.active && row.marketable && Number(row.quantity ?? 0) > 0 &&
      Number(row.amount ?? 0) > 0 && row.minimumPrice !== null &&
      Number(row.price ?? 0) > Number(row.minimumPrice);

    await db.update(seller_visibility_boosts).set({
      followUpDueAt: canCutAgain ? new Date(Date.now() + followUpDelayMs) : null,
      followUpAttempts: 0,
    }).where(eq(seller_visibility_boosts.id, boostId));
  } catch (error) {
    console.error("Boost follow-up rearm failed", { boostId, error });
  }
}

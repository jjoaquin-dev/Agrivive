import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "../../../db";
import { fb_post_logs, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { applySellerPromotionPriceReduction } from "../../seller/services/seller.product.price-reduction.followup";
import { finishBoostFollowUp } from "./integrations.visibility-boost.follow-up.finish";
import { getVisibilityBoostContext } from "./integrations.visibility-boost.context";

/** The 6-hour rule: cuts the price once by the peso amount the seller set, never below their final price. */
export async function reduceVisibilityBoostPrice(boostId: string) {
  const context = await getVisibilityBoostContext(boostId);
  if (context.reason !== "initial") throw new OrderError(409, "Only the first boost lowers the price");
  const productId = context.product.id;

  const result = await db.transaction(async (tx) => {
    const [boost] = await tx.select({ createdAt: seller_visibility_boosts.createdAt })
      .from(seller_visibility_boosts).where(eq(seller_visibility_boosts.id, boostId)).limit(1);
    if (!boost) throw new OrderError(404, "Visibility boost not found");
    const [product] = await tx.select().from(sellers_product)
      .where(eq(sellers_product.id, productId)).for("update").limit(1);
    if (!product) throw new OrderError(404, "Product not found");

    // The newest saved post (first, or the second post of an earlier round) is the price to beat.
    const [firstPost] = await tx.select({ price: fb_post_logs.price }).from(fb_post_logs).where(and(
      eq(fb_post_logs.productId, productId),
      eq(fb_post_logs.status, "success"),
      gte(fb_post_logs.postedAt, boost.createdAt),
    )).orderBy(desc(fb_post_logs.postedAt)).limit(1);
    if (!firstPost) throw new OrderError(409, "The first post has not been published yet");

    const currentPrice = product.productPrice ?? "0.00";
    const base = {
      productId,
      productName: product.productName,
    };
    // n8n writes "X% off", so send the real percent of this round's cut.
    const percentOff = (before: string, after: string) =>
      Number(before) > 0 ? Math.round(((Number(before) - Number(after)) / Number(before)) * 100) : 0;
    const unchanged = (reason: "not_enabled" | "at_floor" | "unavailable") => ({
      ...base, reduced: false, reason, discountPercent: 0, originalPrice: currentPrice, newPrice: currentPrice,
    });

    if (!product.isActive || !product.isMarketable || Number(product.productQty ?? 0) <= 0) {
      return unchanged("unavailable");
    }
    // A retry after a successful cut (price already below the last post) must not cut again.
    if (Number(currentPrice) < Number(firstPost.price)) {
      return { ...base, reduced: true, discountPercent: percentOff(firstPost.price, currentPrice), originalPrice: firstPost.price, newPrice: currentPrice };
    }
    if (Number(product.priceReductionAmount ?? 0) <= 0 || !product.minimumPrice) {
      return unchanged("not_enabled");
    }

    const result = await applySellerPromotionPriceReduction(tx, productId);
    if (!result) return unchanged("at_floor");
    return { ...base, reduced: true, discountPercent: percentOff(result.before, result.after ?? result.before), originalPrice: result.before, newPrice: result.after };
  });
  // Nothing was cut, so there is no second post to wait for.
  if (!result.reduced) await finishBoostFollowUp(boostId);
  return result;
}

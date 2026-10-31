import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "../../../db";
import { fb_post_logs, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { applySellerPromotionPriceReduction } from "../../seller/services/seller.product.price-reduction.followup";
import { finishBoostFollowUp } from "./integrations.visibility-boost.follow-up.finish";
import { getVisibilityBoostContext } from "./integrations.visibility-boost.context";

/** The 6-hour rule: cuts the price once by the percent the seller set, never below their minimum price. */
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

    const [firstPost] = await tx.select({ price: fb_post_logs.price }).from(fb_post_logs).where(and(
      eq(fb_post_logs.productId, productId),
      eq(fb_post_logs.postType, "first_post"),
      eq(fb_post_logs.status, "success"),
      gte(fb_post_logs.postedAt, boost.createdAt),
    )).orderBy(desc(fb_post_logs.postedAt)).limit(1);
    if (!firstPost) throw new OrderError(409, "The first post has not been published yet");

    const currentPrice = product.productPrice ?? "0.00";
    const base = {
      productId,
      productName: product.productName,
      discountPercent: Number(product.priceReductionPercent ?? 0),
    };
    const unchanged = (reason: "not_enabled" | "at_floor" | "unavailable") => ({
      ...base, reduced: false, reason, originalPrice: currentPrice, newPrice: currentPrice,
    });

    if (!product.isActive || !product.isMarketable || Number(product.productQty ?? 0) <= 0) {
      return unchanged("unavailable");
    }
    // A retry after a successful cut must not cut the price a second time.
    if (Number(currentPrice) < Number(firstPost.price)) {
      return { ...base, reduced: true, originalPrice: firstPost.price, newPrice: currentPrice };
    }
    if (Number(product.priceReductionPercent ?? 0) <= 0 || !product.minimumPrice) {
      return unchanged("not_enabled");
    }

    const result = await applySellerPromotionPriceReduction(tx, productId);
    if (!result) return unchanged("at_floor");
    return { ...base, reduced: true, originalPrice: result.before, newPrice: result.after };
  });
  // Nothing was cut, so there is no second post to wait for.
  if (!result.reduced) await finishBoostFollowUp(boostId);
  return result;
}

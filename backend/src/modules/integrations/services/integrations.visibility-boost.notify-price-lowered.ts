import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "../../../db";
import { fb_post_logs, seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { createSellerNotification } from "../../../utils/seller-notifications";

/**
 * After the 6-hour price cut and second post are saved: tells the seller the price went down.
 * The cut was already posted, so no "boost again" prompt is made. Never fails the post.
 */
export async function notifyBoostPriceLowered(boostId: string) {
  try {
    const [boost] = await db.select().from(seller_visibility_boosts)
      .where(eq(seller_visibility_boosts.id, boostId)).limit(1);
    if (!boost) return;
    const [product] = await db.select({
      name: sellers_product.productName,
      price: sellers_product.productPrice,
      periods: sellers_product.priceReductionPeriodsApplied,
    }).from(sellers_product).where(eq(sellers_product.id, boost.productId)).limit(1);
    // The two newest saved posts: this round's post, and the one before it (the price it replaced).
    const [, previousPost] = await db.select({ price: fb_post_logs.price }).from(fb_post_logs).where(and(
      eq(fb_post_logs.productId, boost.productId),
      eq(fb_post_logs.status, "success"),
      gte(fb_post_logs.postedAt, boost.createdAt),
    )).orderBy(desc(fb_post_logs.postedAt)).limit(2);
    if (!product?.price || !previousPost || product.periods < 1 || Number(product.price) >= Number(previousPost.price)) return;

    await db.transaction(async (tx) => {
      await createSellerNotification(tx, {
        sellerId: boost.sellerId,
        kind: "price_lowered",
        dedupeKey: `price-lowered:${boost.productId}:${product.periods}`,
        productId: boost.productId,
        payload: { productName: product.name, priceBefore: previousPost.price, priceAfter: product.price },
      });
    });
  } catch (error) {
    console.error("Price lowered notification failed", { boostId, error });
  }
}

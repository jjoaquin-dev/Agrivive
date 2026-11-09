import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews, orders } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { shapeOrderReview } from "../../../utils/review-format";
import type { BuyerReviewBody } from "../model/buyer.order.review";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";
import { ignoreReviewBomb } from "../../../utils/trust/review-bomb";
import { recalculateTrustStanding } from "../../../utils/trust/recalculate";
import { recordLowRatingIfCounted } from "../../../utils/trust/low-rating";

/** One review per completed order: product stars, service stars and an optional comment. */
export async function createBuyerReview(buyerId: string, orderId: string, body: BuyerReviewBody) {
  const created = await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(and(
      eq(orders.id, orderId), eq(orders.buyersId, buyerId),
    )).limit(1);
    if (!order) throw new OrderError(404, "Order not found");
    if (order.status !== "completed") throw new OrderError(409, "Only completed orders can be reviewed");
    const [review] = await tx.insert(order_reviews).values({
      orderId, buyerId, sellerId: order.sellersId,
      rating: body.serviceRating, productRating: body.productRating, review: body.review?.trim() || null,
    }).onConflictDoNothing({ target: order_reviews.orderId }).returning();
    if (!review) throw new OrderError(409, "Order already reviewed");
    const bombed = await ignoreReviewBomb(tx, review);
    const [stored] = await tx.select().from(order_reviews).where(eq(order_reviews.id, review.id)).limit(1);
    return { review: stored ?? review, bombed, eventKey: stored?.ignoredAt ? null : await recordLowRatingIfCounted(tx, review) };
  });
  // Only low service stars with a reason (or a 2nd low rating in 30 days) change the trust score. Product stars never do.
  if (created.eventKey) await evaluateTrustAction(created.review.sellerId, created.review.orderId, created.eventKey, "low_rating");
  if (created.bombed) await recalculateTrustStanding(created.bombed, "Some ratings were ignored");
  const review = created.review;
  return shapeOrderReview(review, null);
}

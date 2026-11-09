import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { isReviewEditable, reviewEditDays, shapeOrderReview } from "../../../utils/review-format";
import { reviewPhotoUrl } from "../../../utils/review-photo";
import type { BuyerReviewEditBody } from "../model/buyer.order.review";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";
import { recordLowRatingIfCounted } from "../../../utils/trust/low-rating";
import { recalculateTrustStanding } from "../../../utils/trust/recalculate";
import { trust_events } from "../../../db/schema";

/** The buyer changes their own review. Allowed for a short time after posting; the same row is updated, never a second review. */
export async function editBuyerReview(buyerId: string, orderId: string, body: BuyerReviewEditBody, now: Date = new Date()) {
  if (body.productRating === undefined && body.serviceRating === undefined && body.review === undefined) {
    throw new OrderError(400, "Change at least one thing");
  }
  const review = await db.transaction(async (tx) => {
    const [current] = await tx.select().from(order_reviews).where(and(
      eq(order_reviews.orderId, orderId), eq(order_reviews.buyerId, buyerId),
    )).for("update").limit(1);
    if (!current) throw new OrderError(404, "Review not found");
    if (!isReviewEditable(current.createdAt, now)) {
      throw new OrderError(403, `Reviews can only be changed for ${reviewEditDays} days`);
    }
    const [updated] = await tx.update(order_reviews).set({
      ...(body.serviceRating !== undefined ? { rating: body.serviceRating } : {}),
      ...(body.productRating !== undefined ? { productRating: body.productRating } : {}),
      ...(body.review !== undefined ? { review: body.review.trim() || null } : {}),
      updatedAt: now,
    }).where(eq(order_reviews.id, current.id)).returning();
    // The stored low-rating event follows the edit: a raised rating removes it, a low one is checked like a first one.
    let eventKey: string | null = null;
    if (updated!.rating <= 2 && !updated!.ignoredAt) eventKey = await recordLowRatingIfCounted(tx, updated!);
    else await tx.update(trust_events).set({ invalidatedAt: now }).where(eq(trust_events.eventKey, `low-rating:${orderId}`));
    return { updated: updated!, eventKey };
  });
  const { updated, eventKey } = review;
  if (eventKey) await evaluateTrustAction(updated.sellerId, updated.orderId, eventKey, "low_rating");
  else if (updated.rating > 2) await recalculateTrustStanding(updated.sellerId, "A rating was changed");
  return shapeOrderReview(updated, await reviewPhotoUrl(updated.photoKey));
}

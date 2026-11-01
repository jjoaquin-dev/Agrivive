import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews, orders } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import type { BuyerReviewBody } from "../model/buyer.order.review";
import { evaluateTrustAction } from "../../../utils/trust/evaluate-action";

export async function createBuyerReview(buyerId: string, orderId: string, body: BuyerReviewBody) {
  const review = await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(and(
      eq(orders.id, orderId), eq(orders.buyersId, buyerId),
    )).limit(1);
    if (!order) throw new OrderError(404, "Order not found");
    if (order.status !== "completed") throw new OrderError(409, "Only completed orders can be reviewed");
    const [review] = await tx.insert(order_reviews).values({
      orderId, buyerId, sellerId: order.sellersId, rating: body.rating, review: body.review?.trim() || null,
    }).onConflictDoNothing({ target: order_reviews.orderId }).returning();
    if (!review) throw new OrderError(409, "Order already reviewed");
    return review;
  });
  // Only a low rating can change the score, so a good review never restarts a pause.
  if (review.rating <= 2) await evaluateTrustAction(review.sellerId, review.orderId, undefined, "low_rating");
  return review;
}

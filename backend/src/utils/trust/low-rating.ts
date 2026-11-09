import { and, eq, gte, lt, lte, ne, sql } from "drizzle-orm";
import { order_reviews } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { recordTrustEvent } from "./index";

const LOW_RATING_REPEAT_DAYS = 30;

/**
 * Table 1: a 1 or 2 star service rating on a completed order adds 1 point only if the buyer wrote a reason,
 * or it is the seller's 2nd low rating within 30 days. Returns the new event key, or null when it does not count.
 */
export async function recordLowRatingIfCounted(tx: OrderTransaction, review: typeof order_reviews.$inferSelect) {
  if (review.rating > 2) return null;
  const hasReason = (review.review?.trim().length ?? 0) > 0;
  let counts = hasReason;
  if (!counts) {
    const from = new Date(review.createdAt.getTime() - LOW_RATING_REPEAT_DAYS * 86_400_000);
    const [other] = await tx.select({ n: sql<number>`count(*)::int` }).from(order_reviews).where(and(
      eq(order_reviews.sellerId, review.sellerId), ne(order_reviews.orderId, review.orderId),
      lte(order_reviews.rating, 2), gte(order_reviews.createdAt, from), lt(order_reviews.createdAt, review.createdAt)));
    counts = Number(other?.n ?? 0) > 0;
  }
  if (!counts) return null;
  const eventKey = `low-rating:${review.orderId}`;
  const [event] = await recordTrustEvent(tx, { eventKey, orderId: review.orderId, subjectId: review.sellerId, kind: "low_rating", classification: "verified", sourceId: review.id, reason: hasReason ? "Low rating with a reason" : "2nd low rating in 30 days" });
  return event ? eventKey : null;
}

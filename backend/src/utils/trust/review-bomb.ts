import { and, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { order_reviews, trust_events, user } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { notifyBuyer } from "../pickup/notify";

export const BOMB_MIN_RATINGS = 5;
export const BOMB_WINDOW_HOURS = 24;
export const BOMB_ACCOUNT_DAYS = 7;

/**
 * Section 4.2: a rating is ignored when its account is under 7 days old AND 5 or more such ratings of 1 or 2 stars
 * hit one seller within 24 hours. Ignored ratings leave the seller's average, stars and trust score. The buyers get
 * 0 points and a notice, because some may be honest. Returns the seller id when ratings were just ignored.
 */
export async function ignoreReviewBomb(tx: OrderTransaction, review: typeof order_reviews.$inferSelect) {
  if (review.rating > 2) return null;
  const windowStart = new Date(review.createdAt.getTime() - BOMB_WINDOW_HOURS * 3_600_000);
  const group = await tx.select({ id: order_reviews.id, buyerId: order_reviews.buyerId, orderId: order_reviews.orderId, ignoredAt: order_reviews.ignoredAt })
    .from(order_reviews).innerJoin(user, eq(user.id, order_reviews.buyerId)).where(and(
      eq(order_reviews.sellerId, review.sellerId), sql`${order_reviews.rating} <= 2`, gte(order_reviews.createdAt, windowStart),
      sql`${user.createdAt} > ${order_reviews.createdAt} - make_interval(days => ${BOMB_ACCOUNT_DAYS})`));
  if (group.length < BOMB_MIN_RATINGS) return null;
  const fresh = group.filter((row) => !row.ignoredAt);
  if (!fresh.length) return null;
  const ids = group.map((row) => row.id);
  const now = new Date();
  await tx.update(order_reviews).set({ ignoredAt: now }).where(and(inArray(order_reviews.id, ids), isNull(order_reviews.ignoredAt)));
  // A low rating that was already counted as a trust event is removed with the rating.
  await tx.update(trust_events).set({ invalidatedAt: now }).where(and(
    eq(trust_events.kind, "low_rating"), isNull(trust_events.invalidatedAt), inArray(trust_events.sourceId, ids)));
  for (const row of fresh) {
    await notifyBuyer(tx, { buyerId: row.buyerId, orderId: row.orderId, key: `review-bomb:${row.id}`, kind: "trust_decision",
      message: "Your rating was set aside. Many low ratings from new accounts reached one seller in one day, so the system did not count them. This adds 0 points to you." });
  }
  return review.sellerId;
}

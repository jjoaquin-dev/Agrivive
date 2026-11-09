import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { isReviewEditable, reviewEditDays, shapeOrderReview } from "../../../utils/review-format";
import { reviewPhotoUrl, storeReviewPhoto } from "../../../utils/review-photo";

/** Adds or replaces the one optional photo on the buyer's review. Same edit window as the stars. */
export async function setBuyerReviewPhoto(buyerId: string, orderId: string, file: File) {
  const [current] = await db.select().from(order_reviews).where(and(
    eq(order_reviews.orderId, orderId), eq(order_reviews.buyerId, buyerId),
  )).limit(1);
  if (!current) throw new OrderError(404, "Review not found");
  if (!isReviewEditable(current.createdAt)) {
    throw new OrderError(403, `Reviews can only be changed for ${reviewEditDays} days`);
  }
  const photoKey = await storeReviewPhoto(orderId, file);
  const [updated] = await db.update(order_reviews).set({ photoKey, updatedAt: new Date() })
    .where(eq(order_reviews.id, current.id)).returning();
  return shapeOrderReview(updated!, await reviewPhotoUrl(photoKey));
}

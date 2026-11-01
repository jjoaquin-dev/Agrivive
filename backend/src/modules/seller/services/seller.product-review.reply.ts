import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { product_reviews } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

/** A seller answers one product review, once. */
export function respondSellerProductReview(sellerId: string, reviewId: string, response: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [review] = await tx.update(product_reviews).set({ sellerResponse: response.trim() }).where(and(
      eq(product_reviews.id, reviewId),
      eq(product_reviews.sellerId, sellerId),
      isNull(product_reviews.sellerResponse),
    )).returning();
    if (!review) throw new OrderError(404, "Unanswered review not found");
    return review;
  });
}

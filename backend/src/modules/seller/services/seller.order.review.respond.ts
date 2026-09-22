import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export function respondSellerReview(sellerId: string, orderId: string, response: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [review] = await tx.update(order_reviews).set({ sellerResponse: response.trim() })
      .where(and(eq(order_reviews.orderId, orderId), eq(order_reviews.sellerId, sellerId),
        isNull(order_reviews.sellerResponse))).returning();
    if (!review) throw new OrderError(404, "Unanswered review not found");
    return review;
  });
}

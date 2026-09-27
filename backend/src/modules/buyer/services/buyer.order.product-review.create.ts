import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { ordered_items, orders, product_reviews } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import type { BuyerProductReviewBody } from "../model/buyer.order.review";

export function createBuyerProductReview(
  buyerId: string,
  orderId: string,
  itemId: string,
  body: BuyerProductReviewBody,
) {
  return db.transaction(async (tx) => {
    const [purchase] = await tx
      .select({
        orderId: orders.id,
        buyerId: orders.buyersId,
        sellerId: orders.sellersId,
        status: orders.status,
        orderedItemId: ordered_items.id,
        productId: ordered_items.productId,
      })
      .from(ordered_items)
      .innerJoin(orders, eq(orders.id, ordered_items.ordersId))
      .where(and(
        eq(orders.id, orderId),
        eq(ordered_items.id, itemId),
        eq(orders.buyersId, buyerId),
      ))
      .limit(1);

    if (!purchase) throw new OrderError(404, "Order item not found");
    if (purchase.status !== "completed") {
      throw new OrderError(409, "Only completed orders can be reviewed");
    }

    const [review] = await tx
      .insert(product_reviews)
      .values({
        orderId: purchase.orderId,
        orderedItemId: purchase.orderedItemId,
        productId: purchase.productId,
        buyerId: purchase.buyerId,
        sellerId: purchase.sellerId,
        rating: body.rating,
        review: body.review?.trim() || null,
      })
      .onConflictDoNothing({ target: product_reviews.orderedItemId })
      .returning();

    if (!review) throw new OrderError(409, "This product has already been reviewed for this order");
    return review;
  });
}

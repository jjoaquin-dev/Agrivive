import { and, asc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { ordered_items, orders, product_reviews, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

export async function getBuyerProductReviewEligibility(buyerId: string, productId: string) {
  const [product] = await db
    .select({ id: sellers_product.id })
    .from(sellers_product)
    .where(eq(sellers_product.id, productId))
    .limit(1);
  if (!product) throw new OrderError(404, "Marketplace product not found");

  const purchases = await db
    .select({
      orderId: orders.id,
      itemId: ordered_items.id,
      productName: ordered_items.productName,
      reviewId: product_reviews.id,
      rating: product_reviews.rating,
      review: product_reviews.review,
      createdAt: product_reviews.createdAt,
    })
    .from(ordered_items)
    .innerJoin(orders, eq(orders.id, ordered_items.ordersId))
    .leftJoin(product_reviews, eq(product_reviews.orderedItemId, ordered_items.id))
    .where(and(
      eq(ordered_items.productId, productId),
      eq(orders.buyersId, buyerId),
      eq(orders.status, "completed"),
    ))
    .orderBy(asc(orders.createdAt));

  return {
    productId,
    purchases: purchases.map((purchase) => ({
      orderId: purchase.orderId,
      itemId: purchase.itemId,
      productName: purchase.productName ?? "Product",
      review: purchase.reviewId ? {
        id: purchase.reviewId,
        rating: purchase.rating!,
        review: purchase.review,
        createdAt: purchase.createdAt!.toISOString(),
      } : null,
    })),
  };
}

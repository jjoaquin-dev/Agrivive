import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { ordered_items, orders, product_reviews } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

export async function readBuyerProductReview(buyerId: string, orderId: string, itemId: string) {
  const [purchase] = await db
    .select({ id: ordered_items.id })
    .from(ordered_items)
    .innerJoin(orders, eq(orders.id, ordered_items.ordersId))
    .where(and(
      eq(orders.id, orderId),
      eq(ordered_items.id, itemId),
      eq(orders.buyersId, buyerId),
    ))
    .limit(1);
  if (!purchase) throw new OrderError(404, "Order item not found");

  const [review] = await db
    .select()
    .from(product_reviews)
    .where(and(
      eq(product_reviews.orderedItemId, itemId),
      eq(product_reviews.buyerId, buyerId),
    ))
    .limit(1);
  if (!review) throw new OrderError(404, "Review not found");
  return review;
}

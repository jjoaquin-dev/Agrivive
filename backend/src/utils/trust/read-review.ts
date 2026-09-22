import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { order_reviews, orders } from "../../db/schema";
import { OrderError, type OrderSide } from "../order-types";

export async function readOrderReview(userId: string, orderId: string, side: OrderSide) {
  const owner = side === "buyer" ? orders.buyersId : orders.sellersId;
  const [order] = await db.select({ id: orders.id }).from(orders)
    .where(and(eq(orders.id, orderId), eq(owner, userId))).limit(1);
  if (!order) throw new OrderError(404, "Order not found");
  const [review] = await db.select().from(order_reviews).where(eq(order_reviews.orderId, orderId)).limit(1);
  if (!review) throw new OrderError(404, "Review not found");
  return review;
}

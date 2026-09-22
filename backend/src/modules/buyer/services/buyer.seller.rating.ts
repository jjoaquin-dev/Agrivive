import { eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews } from "../../../db/schema";

export async function readSellerRating(sellerId: string) {
  const [result] = await db.select({
    count: sql<number>`count(*)::int`,
    average: sql<string>`round(avg(${order_reviews.rating})::numeric, 2)::text`,
  }).from(order_reviews).where(eq(order_reviews.sellerId, sellerId));
  return { sellerId, count: result?.count ?? 0, average: result?.average ?? null };
}

import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews } from "../../../db/schema";
import { reviewCounts } from "../../../utils/trust/review-counts";

export async function readSellerRating(sellerId: string) {
  const [result] = await db.select({
    count: sql<number>`count(*)::int`,
    average: sql<string | null>`round(avg(${order_reviews.rating})::numeric, 2)::text`,
  }).from(order_reviews).where(and(eq(order_reviews.sellerId, sellerId), reviewCounts));
  return { sellerId, count: result?.count ?? 0, average: result?.average ?? null };
}

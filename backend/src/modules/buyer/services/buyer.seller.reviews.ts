import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews, user } from "../../../db/schema";

export async function readSellerReviews(sellerId: string) {
  const [summary] = await db
    .select({
      count: sql<number>`count(*)::int`,
      average: sql<string>`round(avg(${order_reviews.rating})::numeric, 1)::text`,
      star5: sql<number>`count(case when ${order_reviews.rating} = 5 then 1 end)::int`,
      star4: sql<number>`count(case when ${order_reviews.rating} = 4 then 1 end)::int`,
      star3: sql<number>`count(case when ${order_reviews.rating} = 3 then 1 end)::int`,
      star2: sql<number>`count(case when ${order_reviews.rating} = 2 then 1 end)::int`,
      star1: sql<number>`count(case when ${order_reviews.rating} = 1 then 1 end)::int`,
    })
    .from(order_reviews)
    .where(eq(order_reviews.sellerId, sellerId));

  const rows = await db
    .select({
      id: order_reviews.id,
      rating: order_reviews.rating,
      review: order_reviews.review,
      sellerResponse: order_reviews.sellerResponse,
      createdAt: order_reviews.createdAt,
      buyerName: user.name,
    })
    .from(order_reviews)
    .leftJoin(user, eq(user.id, order_reviews.buyerId))
    .where(eq(order_reviews.sellerId, sellerId))
    .orderBy(desc(order_reviews.createdAt))
    .limit(10);

  const reviews = rows.map((r) => {
    let formattedName = "Verified buyer";
    if (r.buyerName) {
      const parts = r.buyerName.trim().split(/\s+/);
      const firstName = parts[0];
      const lastInitial = parts[1]?.[0] ? ` ${parts[1][0]}.` : "";
      formattedName = `${firstName}${lastInitial}`;
    }
    return {
      id: r.id,
      rating: r.rating,
      review: r.review,
      sellerResponse: r.sellerResponse,
      createdAt: r.createdAt.toISOString(),
      buyerName: formattedName,
    };
  });

  return {
    sellerId,
    count: summary?.count ?? 0,
    average: summary?.average ?? null,
    breakdown: {
      5: summary?.star5 ?? 0,
      4: summary?.star4 ?? 0,
      3: summary?.star3 ?? 0,
      2: summary?.star2 ?? 0,
      1: summary?.star1 ?? 0,
    },
    reviews,
  };
}

import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { product_reviews, sellers_product, user } from "../../../db/schema";
import { formatReviewBuyerName } from "../../../utils/review-format";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import type { SellerReviewsQueryOptions } from "./seller.reviews.list";

/** Same answer shape as the pickup reviews list, so the app can show both with one screen. Each review names its product in `items`. */
export async function readSellerProductReviewsList(sellerId: string, options: SellerReviewsQueryOptions = {}) {
  await db.transaction((tx) => requireVerifiedSeller(tx, sellerId));
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;
  const mine = eq(product_reviews.sellerId, sellerId);

  const [summary] = await db.select({
    count: sql<number>`count(*)::int`,
    average: sql<string>`round(avg(${product_reviews.rating})::numeric, 1)::text`,
    star5: sql<number>`count(case when ${product_reviews.rating} = 5 then 1 end)::int`,
    star4: sql<number>`count(case when ${product_reviews.rating} = 4 then 1 end)::int`,
    star3: sql<number>`count(case when ${product_reviews.rating} = 3 then 1 end)::int`,
    star2: sql<number>`count(case when ${product_reviews.rating} = 2 then 1 end)::int`,
    star1: sql<number>`count(case when ${product_reviews.rating} = 1 then 1 end)::int`,
    unansweredCount: sql<number>`count(case when ${product_reviews.sellerResponse} is null then 1 end)::int`,
  }).from(product_reviews).where(mine);

  const conditions = [mine];
  if (options.filter === "unanswered") conditions.push(sql`${product_reviews.sellerResponse} is null`);
  else if (options.filter === "replied") conditions.push(sql`${product_reviews.sellerResponse} is not null`);
  if (options.rating && options.rating >= 1 && options.rating <= 5) conditions.push(eq(product_reviews.rating, options.rating));

  const rows = await db.select({
    id: product_reviews.id,
    orderId: product_reviews.orderId,
    rating: product_reviews.rating,
    review: product_reviews.review,
    sellerResponse: product_reviews.sellerResponse,
    createdAt: product_reviews.createdAt,
    buyerName: user.name,
    productName: sellers_product.productName,
  }).from(product_reviews)
    .leftJoin(user, eq(user.id, product_reviews.buyerId))
    .leftJoin(sellers_product, eq(sellers_product.id, product_reviews.productId))
    .where(and(...conditions))
    .orderBy(desc(product_reviews.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    summary: {
      count: summary?.count ?? 0,
      average: summary?.average ?? null,
      breakdown: {
        5: summary?.star5 ?? 0, 4: summary?.star4 ?? 0, 3: summary?.star3 ?? 0, 2: summary?.star2 ?? 0, 1: summary?.star1 ?? 0,
      },
      unansweredCount: summary?.unansweredCount ?? 0,
    },
    reviews: rows.map((row) => ({
      id: row.id,
      orderId: row.orderId,
      rating: row.rating,
      review: row.review,
      sellerResponse: row.sellerResponse,
      createdAt: row.createdAt.toISOString(),
      buyerName: formatReviewBuyerName(row.buyerName),
      items: row.productName ? [row.productName] : [],
    })),
  };
}

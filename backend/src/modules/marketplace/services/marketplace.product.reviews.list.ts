import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { product_reviews, sellers_product, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

export async function listMarketplaceProductReviews(productId: string) {
  const [product] = await db
    .select({ id: sellers_product.id })
    .from(sellers_product)
    .where(eq(sellers_product.id, productId))
    .limit(1);
  if (!product) throw new OrderError(404, "Marketplace product not found");

  const [summary] = await db
    .select({
      count: sql<number>`count(*)::int`,
      average: sql<string>`round(avg(${product_reviews.rating})::numeric, 1)::text`,
      star5: sql<number>`count(case when ${product_reviews.rating} = 5 then 1 end)::int`,
      star4: sql<number>`count(case when ${product_reviews.rating} = 4 then 1 end)::int`,
      star3: sql<number>`count(case when ${product_reviews.rating} = 3 then 1 end)::int`,
      star2: sql<number>`count(case when ${product_reviews.rating} = 2 then 1 end)::int`,
      star1: sql<number>`count(case when ${product_reviews.rating} = 1 then 1 end)::int`,
    })
    .from(product_reviews)
    .where(eq(product_reviews.productId, productId));

  const rows = await db
    .select({
      id: product_reviews.id,
      rating: product_reviews.rating,
      review: product_reviews.review,
      createdAt: product_reviews.createdAt,
      buyerName: user.name,
    })
    .from(product_reviews)
    .leftJoin(user, eq(user.id, product_reviews.buyerId))
    .where(eq(product_reviews.productId, productId))
    .orderBy(desc(product_reviews.createdAt))
    .limit(10);

  const reviews = rows.map((row) => {
    const name = row.buyerName?.trim().split(/\s+/) ?? [];
    const buyerName = name[0]
      ? `${name[0]}${name[1]?.[0] ? ` ${name[1][0]}.` : ""}`
      : "Verified buyer";
    return {
      id: row.id,
      rating: row.rating,
      review: row.review,
      createdAt: row.createdAt.toISOString(),
      buyerName,
    };
  });

  return {
    productId,
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

import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews, sellers_product, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { formatReviewBuyerName } from "../../../utils/review-format";
import { reviewPhotoUrl } from "../../../utils/review-photo";

/** Reviews for a product: the product stars buyers gave on orders that included it, with the shared comment and photo. */
export async function listMarketplaceProductReviews(productId: string) {
  const [product] = await db
    .select({ id: sellers_product.id })
    .from(sellers_product)
    .where(eq(sellers_product.id, productId))
    .limit(1);
  if (!product) throw new OrderError(404, "Marketplace product not found");

  const hasProduct = and(
    isNotNull(order_reviews.productRating),
    sql`exists (select 1 from ordered_items where ordered_items.orders_id = ${order_reviews.orderId} and ordered_items.product_id = ${productId})`,
  );
  const stars = (value: number) => sql<number>`count(case when ${order_reviews.productRating} = ${value} then 1 end)::int`;

  const [summary] = await db
    .select({
      count: sql<number>`count(*)::int`,
      average: sql<string>`round(avg(${order_reviews.productRating})::numeric, 1)::text`,
      star5: stars(5), star4: stars(4), star3: stars(3), star2: stars(2), star1: stars(1),
    })
    .from(order_reviews)
    .where(hasProduct);

  const rows = await db
    .select({
      id: order_reviews.id,
      rating: order_reviews.productRating,
      review: order_reviews.review,
      photoKey: order_reviews.photoKey,
      sellerResponse: order_reviews.sellerResponse,
      createdAt: order_reviews.createdAt,
      buyerName: user.name,
    })
    .from(order_reviews)
    .leftJoin(user, eq(user.id, order_reviews.buyerId))
    .where(hasProduct)
    .orderBy(desc(order_reviews.createdAt))
    .limit(10);

  const photoUrls = await Promise.all(rows.map((row) => reviewPhotoUrl(row.photoKey)));
  const reviews = rows.map((row, index) => ({
    id: row.id,
    rating: row.rating!,
    review: row.review,
    photoUrl: photoUrls[index] ?? null,
    sellerResponse: row.sellerResponse,
    createdAt: row.createdAt.toISOString(),
    buyerName: formatReviewBuyerName(row.buyerName),
  }));

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

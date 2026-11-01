import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_reviews, ordered_items, user } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { formatReviewBuyerName } from "../../../utils/review-format";

export interface SellerReviewsQueryOptions {
  filter?: "all" | "unanswered" | "replied";
  rating?: number;
  limit?: number;
  offset?: number;
}

export async function readSellerReviewsList(
  sellerId: string,
  options: SellerReviewsQueryOptions = {},
) {
  await db.transaction((tx) => requireVerifiedSeller(tx, sellerId));

  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;

  const [summary] = await db
    .select({
      count: sql<number>`count(*)::int`,
      average: sql<string>`round(avg(${order_reviews.rating})::numeric, 1)::text`,
      star5: sql<number>`count(case when ${order_reviews.rating} = 5 then 1 end)::int`,
      star4: sql<number>`count(case when ${order_reviews.rating} = 4 then 1 end)::int`,
      star3: sql<number>`count(case when ${order_reviews.rating} = 3 then 1 end)::int`,
      star2: sql<number>`count(case when ${order_reviews.rating} = 2 then 1 end)::int`,
      star1: sql<number>`count(case when ${order_reviews.rating} = 1 then 1 end)::int`,
      unansweredCount: sql<number>`count(case when ${order_reviews.sellerResponse} is null then 1 end)::int`,
    })
    .from(order_reviews)
    .where(eq(order_reviews.sellerId, sellerId));

  const conditions = [eq(order_reviews.sellerId, sellerId)];
  if (options.filter === "unanswered") {
    conditions.push(sql`${order_reviews.sellerResponse} is null`);
  } else if (options.filter === "replied") {
    conditions.push(sql`${order_reviews.sellerResponse} is not null`);
  }
  if (options.rating && options.rating >= 1 && options.rating <= 5) {
    conditions.push(eq(order_reviews.rating, options.rating));
  }

  const rows = await db
    .select({
      id: order_reviews.id,
      orderId: order_reviews.orderId,
      rating: order_reviews.rating,
      review: order_reviews.review,
      sellerResponse: order_reviews.sellerResponse,
      createdAt: order_reviews.createdAt,
      buyerName: user.name,
    })
    .from(order_reviews)
    .leftJoin(user, eq(user.id, order_reviews.buyerId))
    .where(and(...conditions))
    .orderBy(desc(order_reviews.createdAt))
    .limit(limit)
    .offset(offset);

  const orderIds = rows.map((r) => r.orderId);
  const itemsByOrder = new Map<string, string[]>();
  if (orderIds.length > 0) {
    const items = await db
      .select({
        ordersId: ordered_items.ordersId,
        productName: ordered_items.productName,
      })
      .from(ordered_items)
      .where(inArray(ordered_items.ordersId, orderIds));

    for (const item of items) {
      if (!item.productName) continue;
      const list = itemsByOrder.get(item.ordersId) ?? [];
      list.push(item.productName);
      itemsByOrder.set(item.ordersId, list);
    }
  }

  const reviews = rows.map((r) => {
    return {
      id: r.id,
      orderId: r.orderId,
      rating: r.rating,
      review: r.review,
      sellerResponse: r.sellerResponse,
      createdAt: r.createdAt.toISOString(),
      buyerName: formatReviewBuyerName(r.buyerName),
      items: itemsByOrder.get(r.orderId) ?? [],
    };
  });

  return {
    summary: {
      count: summary?.count ?? 0,
      average: summary?.average ?? null,
      breakdown: {
        5: summary?.star5 ?? 0,
        4: summary?.star4 ?? 0,
        3: summary?.star3 ?? 0,
        2: summary?.star2 ?? 0,
        1: summary?.star1 ?? 0,
      },
      unansweredCount: summary?.unansweredCount ?? 0,
    },
    reviews,
  };
}

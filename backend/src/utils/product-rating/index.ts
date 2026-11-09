import { sql } from "drizzle-orm";
import { db } from "../../db";

export type ProductRating = { average: string | null; count: number };

/**
 * Product stars come from order reviews: the buyer's product rating counts once for each product in that order.
 * Service stars are never part of this.
 */
export async function readProductRatings(productIds: string[]): Promise<Map<string, ProductRating>> {
  const ratings = new Map<string, ProductRating>();
  if (!productIds.length) return ratings;
  const result = await db.execute(sql`
    select product_id, count(*)::int as count, round(avg(product_rating)::numeric, 1)::text as average
    from (
      select distinct ordered_items.product_id, order_reviews.id, order_reviews.product_rating
      from order_reviews
      inner join ordered_items on ordered_items.orders_id = order_reviews.order_id
      where order_reviews.product_rating is not null and order_reviews.ignored_at is null
        and ordered_items.product_id in (${sql.join(productIds.map((id) => sql`${id}::uuid`), sql`, `)})
    ) as product_stars
    group by product_id
  `);
  for (const row of result.rows as { product_id: string; count: number; average: string }[]) {
    ratings.set(row.product_id, { average: row.average, count: Number(row.count) });
  }
  return ratings;
}

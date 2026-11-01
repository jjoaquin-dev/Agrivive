import { sql } from "drizzle-orm";
import { db } from "../../../db";
import { requireVerifiedSeller } from "../../../utils/seller-access";

type Row = {
  id: string;
  product_id: string;
  product_name: string;
  image_url: string | null;
  caption: string | null;
  facebook_post_id: string | null;
  price_before: string;
  price_after: string;
  posted_at: Date;
};

/** Facebook posts that announced a lower price than the post before them, newest first. */
export async function listSellerPriceDropHistory(sellerId: string, limit = 20, cursor?: string) {
  await db.transaction((tx) => requireVerifiedSeller(tx, sellerId));
  const cursorDate = cursor ? new Date(cursor) : null;
  const before = cursorDate && !isNaN(cursorDate.getTime()) ? sql`and d.posted_at < ${cursorDate.toISOString()}` : sql``;

  const result = await db.execute<Row>(sql`
    select d.id, d.product_id, p.product_name, p.image_url, d.caption, d.facebook_post_id,
      d.previous_price as price_before, d.price as price_after, d.posted_at
    from (
      select l.id, l.product_id, l.caption, l.facebook_post_id, l.price, l.post_type, l.posted_at,
        lag(l.price) over (partition by l.product_id order by l.posted_at) as previous_price
      from fb_post_logs l
      inner join sellers_product sp on sp.id = l.product_id
      where sp.user_id = ${sellerId} and l.status = 'success'
    ) d
    inner join sellers_product p on p.id = d.product_id
    where d.post_type = 'second_post' and d.previous_price is not null and d.price < d.previous_price ${before}
    order by d.posted_at desc
    limit ${limit + 1}
  `);

  const rows = result.rows;
  const page = rows.slice(0, limit);
  const items = page.map((row) => ({
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    imageUrl: row.image_url,
    caption: row.caption,
    priceBefore: Number(row.price_before),
    priceAfter: Number(row.price_after),
    postedAt: new Date(row.posted_at).toISOString(),
    postUrl: row.facebook_post_id ? `https://www.facebook.com/${row.facebook_post_id}` : null,
  }));
  const nextCursor = rows.length > limit ? items[items.length - 1].postedAt : null;
  return { items, nextCursor };
}

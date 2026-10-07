import { and, desc, eq, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { seller_promotion_jobs, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import type { SellerPromotionsQuery } from "../model/seller.promotions";

export async function listSellerPromotions(sellerId: string, query: SellerPromotionsQuery = {}) {
  const limit = query.limit ?? 20;
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    let before;
    if (query.cursor) {
      const [anchor] = await tx.select({ id: seller_promotion_jobs.id, readyAt: seller_promotion_jobs.readyAt })
        .from(seller_promotion_jobs).where(and(
          eq(seller_promotion_jobs.id, query.cursor),
          eq(seller_promotion_jobs.sellerId, sellerId),
          eq(seller_promotion_jobs.status, "ready"),
        )).limit(1);
      if (!anchor?.readyAt) throw new OrderError(400, "Invalid promotion cursor");
      before = or(
        lt(seller_promotion_jobs.readyAt, anchor.readyAt),
        and(eq(seller_promotion_jobs.readyAt, anchor.readyAt), lt(seller_promotion_jobs.id, anchor.id)),
      );
    }

    const rows = await tx.select({
      id: seller_promotion_jobs.id,
      stage: seller_promotion_jobs.stage,
      productId: seller_promotion_jobs.productId,
      productName: sellers_product.productName,
      headline: seller_promotion_jobs.headline,
      caption: seller_promotion_jobs.caption,
      createdAt: seller_promotion_jobs.createdAt,
      readyAt: seller_promotion_jobs.readyAt,
      readAt: seller_promotion_jobs.readAt,
    }).from(seller_promotion_jobs)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_promotion_jobs.productId))
      .where(and(
        eq(seller_promotion_jobs.sellerId, sellerId),
        eq(seller_promotion_jobs.status, "ready"),
        before,
      )).orderBy(desc(seller_promotion_jobs.readyAt), desc(seller_promotion_jobs.id)).limit(limit + 1);
    const items = rows.slice(0, limit).map((row) => ({
      ...row,
      createdAt: row.readyAt ?? row.createdAt,
    }));
    const [unread] = await tx.select({ count: sql<number>`count(*)::int` })
      .from(seller_promotion_jobs).where(and(
        eq(seller_promotion_jobs.sellerId, sellerId),
        eq(seller_promotion_jobs.status, "ready"),
        isNull(seller_promotion_jobs.readAt),
      ));
    return {
      items,
      nextCursor: rows.length > limit && items.length ? items[items.length - 1].id : null,
      unreadCount: Number(unread?.count ?? 0),
    };
  });
}

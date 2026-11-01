import { and, desc, eq, isNull, lt, sql } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { getPriceDropPostCooldownEnd } from "../../../utils/boost-cooldown";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export async function listSellerVisibilityBoostPrompts(sellerId: string, limit = 20, cursor?: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    let before;
    if (cursor) {
      const cursorDate = new Date(cursor);
      if (!isNaN(cursorDate.getTime())) {
        before = lt(seller_visibility_boosts.createdAt, cursorDate);
      }
    }
    const conditions = [
      eq(seller_visibility_boosts.sellerId, sellerId),
      eq(seller_visibility_boosts.status, "prompt"),
    ];
    if (before) conditions.push(before);

    const rows = await tx.select({
      id: seller_visibility_boosts.id,
      productId: seller_visibility_boosts.productId,
      productName: sellers_product.productName,
      reason: seller_visibility_boosts.reason,
      reductionPeriod: seller_visibility_boosts.reductionPeriod,
      priceBefore: seller_visibility_boosts.priceBefore,
      priceAfter: seller_visibility_boosts.priceAfter,
      createdAt: seller_visibility_boosts.createdAt,
      readAt: seller_visibility_boosts.readAt,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(and(...conditions))
      .orderBy(desc(seller_visibility_boosts.createdAt))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const waits = new Map<string, string | null>();
    for (const productId of new Set(page.map((row) => row.productId))) {
      const end = await getPriceDropPostCooldownEnd(tx, productId);
      waits.set(productId, end ? end.toISOString() : null);
    }
    const items = page.map((row) => ({ ...row, waitUntil: row.reason === "price_reduction" ? waits.get(row.productId) ?? null : null }));
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].createdAt.toISOString() : null;

    const [unread] = await tx.select({ count: sql<number>`count(*)::int` })
      .from(seller_visibility_boosts).where(and(
        eq(seller_visibility_boosts.sellerId, sellerId),
        eq(seller_visibility_boosts.status, "prompt"),
        isNull(seller_visibility_boosts.readAt),
      ));

    return { items, unreadCount: Number(unread?.count ?? 0), nextCursor };
  });
}

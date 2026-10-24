import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";

function errorMessage(status: string) {
  return status === "failed" ? "We could not send this boost. You can try again." : null;
}

export async function listSellerVisibilityBoostHistory(sellerId: string, limit = 20, cursor?: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    let before;
    if (cursor) {
      const cursorDate = new Date(cursor);
      if (!isNaN(cursorDate.getTime())) {
        before = lt(seller_visibility_boosts.createdAt, cursorDate);
      }
    }
    const conditions = [eq(seller_visibility_boosts.sellerId, sellerId)];
    if (before) conditions.push(before);

    const rows = await tx.select({
      id: seller_visibility_boosts.id,
      productId: seller_visibility_boosts.productId,
      productName: sellers_product.productName,
      imageUrl: sellers_product.imagUrl,
      reason: seller_visibility_boosts.reason,
      reductionPeriod: seller_visibility_boosts.reductionPeriod,
      status: seller_visibility_boosts.status,
      priceBefore: seller_visibility_boosts.priceBefore,
      priceAfter: seller_visibility_boosts.priceAfter,
      createdAt: seller_visibility_boosts.createdAt,
      sentAt: seller_visibility_boosts.sentAt,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(and(...conditions))
      .orderBy(desc(seller_visibility_boosts.createdAt))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].createdAt.toISOString() : null;

    return {
      items: items.map((item) => ({ ...item, errorMessage: errorMessage(item.status) })),
      nextCursor,
      total: items.length,
    };
  });
}

import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export async function listSellerVisibilityBoostPrompts(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const items = await tx.select({
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
      .where(and(
        eq(seller_visibility_boosts.sellerId, sellerId),
        eq(seller_visibility_boosts.status, "prompt"),
      )).orderBy(desc(seller_visibility_boosts.createdAt)).limit(20);
    const [unread] = await tx.select({ count: sql<number>`count(*)::int` })
      .from(seller_visibility_boosts).where(and(
        eq(seller_visibility_boosts.sellerId, sellerId),
        eq(seller_visibility_boosts.status, "prompt"),
        isNull(seller_visibility_boosts.readAt),
      ));
    return { items, unreadCount: Number(unread?.count ?? 0) };
  });
}

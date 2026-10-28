import { and, desc, eq, gt, inArray, isNotNull } from "drizzle-orm";
import { db } from "../../../db";
import { buyer_listing_notices, seller_listing_events, sellers_product, sellers_profile,
  trust_actions, trust_notices, user } from "../../../db/schema";
import { marketplaceSellerVisibility } from "../../marketplace/services/marketplace.visibility";

export async function listBuyerNotices(buyerId: string) {
  const [orderNotices, listingNotices, actionNotices] = await Promise.all([
    db.select({ id: trust_notices.id, orderId: trust_notices.orderId,
    kind: trust_notices.kind, createdAt: trust_notices.createdAt, sentAt: trust_notices.sentAt,
    readAt: trust_notices.readAt,
  }).from(trust_notices).where(eq(trust_notices.recipientId, buyerId))
      .orderBy(desc(trust_notices.createdAt)).limit(100),
    db.select({ id: buyer_listing_notices.id, readAt: buyer_listing_notices.readAt,
      createdAt: buyer_listing_notices.createdAt, productId: seller_listing_events.productId,
      sellerId: seller_listing_events.sellerId, productName: seller_listing_events.productName,
      shopName: seller_listing_events.shopName,
      eventType: seller_listing_events.eventType,
      metadata: seller_listing_events.metadata,
    }).from(buyer_listing_notices)
      .innerJoin(seller_listing_events, eq(seller_listing_events.id, buyer_listing_notices.eventId))
      .where(eq(buyer_listing_notices.buyerId, buyerId))
      .orderBy(desc(buyer_listing_notices.createdAt)).limit(100),
    db.select({
      id: trust_actions.id,
      actionKey: trust_actions.actionKey,
      actionType: trust_actions.actionType,
      reason: trust_actions.reason,
      createdAt: trust_actions.createdAt,
      sourceOrderId: trust_actions.sourceOrderId,
    }).from(trust_actions).where(eq(trust_actions.subjectId, buyerId))
      .orderBy(desc(trust_actions.createdAt)).limit(20),
  ]);
  const productIds = listingNotices.map((notice) => notice.productId);
  const available = productIds.length ? await db.select({ id: sellers_product.id })
    .from(sellers_product)
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .where(and(
      inArray(sellers_product.id, productIds),
      eq(sellers_product.isActive, true), eq(sellers_product.isMarketable, true),
      gt(sellers_product.productQty, "0"), gt(sellers_product.productPrice, "0"),
      isNotNull(sellers_product.publishedAt), marketplaceSellerVisibility(),
    )) : [];
  const availableIds = new Set(available.map((product) => product.id));
  return [
    ...orderNotices.map((notice) => ({ ...notice, productId: null, sellerId: null,
      productName: null, shopName: null, productAvailable: null, price: null, previousPrice: null, reason: null })),
    ...actionNotices.map((action) => ({
      id: `action:${action.id}`,
      kind: action.actionType === "temporary_restriction"
        ? "trust_action_restriction"
        : "trust_action_warning",
      orderId: action.sourceOrderId,
      productId: null,
      sellerId: null,
      productName: null,
      shopName: null,
      productAvailable: null,
      price: null,
      previousPrice: null,
      reason: action.reason,
      createdAt: action.createdAt,
      sentAt: null,
      readAt: null,
    })),
    ...listingNotices.map((notice) => {
      const kind = notice.eventType === "price_drop"
        ? "seller_price_drop"
        : notice.eventType === "restock"
        ? "seller_restock"
        : "seller_new_listing";
      return {
        ...notice,
        id: `listing:${notice.id}`,
        kind,
        orderId: null,
        sentAt: null,
        productAvailable: availableIds.has(notice.productId),
        price: (notice.metadata as { newPrice?: string } | undefined)?.newPrice ?? null,
        previousPrice: (notice.metadata as { oldPrice?: string } | undefined)?.oldPrice ?? null,
        reason: null,
      };
    }),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 100);
}

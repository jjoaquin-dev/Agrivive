import { and, eq, gt, isNotNull } from "drizzle-orm";
import { seller_listing_events, sellers_product, sellers_profile, user } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { marketplaceSellerVisibility } from "../../modules/marketplace/services/marketplace.visibility";

export async function queueFirstPublicListing(tx: OrderTransaction, productId: string) {
  const [listing] = await tx.select({
    productId: sellers_product.id,
    sellerId: sellers_product.userId,
    productName: sellers_product.productName,
    shopName: sellers_profile.shopName,
  }).from(sellers_product)
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .where(and(
      eq(sellers_product.id, productId),
      eq(sellers_product.isActive, true),
      eq(sellers_product.isMarketable, true),
      gt(sellers_product.productQty, "0"),
      gt(sellers_product.productPrice, "0"),
      isNotNull(sellers_product.publishedAt),
      marketplaceSellerVisibility(),
    )).limit(1);
  if (!listing) return false;
  const [created] = await tx.insert(seller_listing_events).values(listing)
    .onConflictDoNothing({ target: seller_listing_events.productId })
    .returning({ id: seller_listing_events.id });
  return Boolean(created);
}

import { and, desc, eq, gt, isNotNull } from "drizzle-orm";
import { seller_listing_events, sellers_product, sellers_profile, user } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { marketplaceSellerVisibility } from "../../modules/marketplace/services/marketplace.visibility";

export type SellerListingEventType = "new_listing" | "price_drop" | "restock";

export type SellerListingEventMetadata = {
  oldPrice?: string;
  newPrice?: string;
  priceReductionPercent?: number;
  stock?: string;
};

export async function queueSellerListingEvent(
  tx: OrderTransaction,
  productId: string,
  eventType: SellerListingEventType = "new_listing",
  metadata: SellerListingEventMetadata = {},
) {
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

  if (eventType === "new_listing") {
    const [existing] = await tx.select({ id: seller_listing_events.id })
      .from(seller_listing_events)
      .where(and(
        eq(seller_listing_events.productId, productId),
        eq(seller_listing_events.eventType, "new_listing"),
      ))
      .limit(1);
    if (existing) return false;
  } else if (eventType === "price_drop") {
    if (!metadata.oldPrice || !metadata.newPrice) return false;
    const oldP = parseFloat(metadata.oldPrice);
    const newP = parseFloat(metadata.newPrice);
    if (isNaN(oldP) || isNaN(newP) || newP >= oldP) return false;
  }

  const [created] = await tx.insert(seller_listing_events).values({
    ...listing,
    eventType,
    metadata,
  }).returning({ id: seller_listing_events.id });

  return Boolean(created);
}

export async function queueFirstPublicListing(tx: OrderTransaction, productId: string) {
  return queueSellerListingEvent(tx, productId, "new_listing");
}

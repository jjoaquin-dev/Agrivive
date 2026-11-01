import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../../db";
import { fb_post_logs, listing_cycles, seller_visibility_boosts, sellers_product, sellers_profile, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

function publicUrl(base: string | undefined, path: string) {
  const origin = base?.trim().replace(/\/$/, "");
  if (!origin) return path;
  try { return new URL(path, origin).toString(); }
  catch { return path; }
}

export async function getVisibilityBoostContext(boostId: string) {
  const [row] = await db.select({
    boostId: seller_visibility_boosts.id,
    reason: seller_visibility_boosts.reason,
    status: seller_visibility_boosts.status,
    productId: sellers_product.id,
    productName: sellers_product.productName,
    productType: sellers_product.productType,
    unit: sellers_product.scalingType,
    price: sellers_product.productPrice,
    quantity: sellers_product.productQty,
    imageUrl: sellers_product.imagUrl,
    productActive: sellers_product.isActive,
    marketable: sellers_product.isMarketable,
    sellerId: sellers_product.userId,
    sellerName: user.name,
    sellerActive: user.isActive,
    sellerVerified: user.emailVerified,
    sellerRoles: user.role,
    shopName: sellers_profile.shopName,
    listingCycleId: seller_visibility_boosts.listingCycleId,
    priceBefore: seller_visibility_boosts.priceBefore,
    boostCreatedAt: seller_visibility_boosts.createdAt,
  }).from(seller_visibility_boosts)
    .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
    .innerJoin(user, eq(user.id, seller_visibility_boosts.sellerId))
    .innerJoin(sellers_profile, and(
      eq(sellers_profile.userId, seller_visibility_boosts.sellerId),
      eq(sellers_profile.isCurrent, true),
    ))
    .where(eq(seller_visibility_boosts.id, boostId)).limit(1);
  if (!row) throw new OrderError(404, "Visibility boost not found");
  if (row.status !== "queued" && row.status !== "sent") {
    throw new OrderError(409, "Visibility boost is not ready for posting");
  }
  if (!row.imageUrl || !row.productActive || !row.marketable || !row.sellerActive ||
    !row.sellerVerified || !row.sellerRoles?.includes("seller") || Number(row.quantity ?? 0) <= 0 ||
    Number(row.price ?? 0) <= 0 || !row.sellerName.trim() || !row.shopName.trim()) {
    throw new OrderError(409, "Listing facts are no longer complete for posting");
  }

  const [cycle] = await db.select({ id: listing_cycles.id }).from(listing_cycles).where(and(
    eq(listing_cycles.productId, row.productId),
    lte(listing_cycles.startedAt, new Date()),
  )).orderBy(desc(listing_cycles.startedAt)).limit(1);
  if (!cycle || cycle.id !== row.listingCycleId) throw new OrderError(409, "Listing cycle is no longer current");

  // The post this boost makes first (first post, or the second post of a price drop) may already be saved.
  const [savedPost] = await db.select({ id: fb_post_logs.id }).from(fb_post_logs).where(and(
    eq(fb_post_logs.productId, row.productId),
    eq(fb_post_logs.postType, row.reason === "initial" ? "first_post" : "second_post"),
    eq(fb_post_logs.status, "success"),
    gte(fb_post_logs.postedAt, row.boostCreatedAt),
  )).limit(1);

  const apiBase = process.env.SOCIAL_PUBLIC_API_URL ?? process.env.BETTER_AUTH_URL;
  return {
    boostId: row.boostId,
    reason: row.reason,
    alreadyPosted: Boolean(savedPost),
    previousPrice: row.priceBefore ? Number(row.priceBefore) : null,
    product: {
      id: row.productId,
      name: row.productName,
      type: row.productType,
      unit: row.unit,
      price: Number(row.price),
      quantity: Number(row.quantity),
      imageUrl: publicUrl(apiBase, `/integrations/media/social-products/${row.productId}`),
      listingUrl: publicUrl(process.env.WEB_APP_URL, `/marketplace/${row.productId}`),
    },
    seller: {
      id: row.sellerId,
      name: row.sellerName,
      shopName: row.shopName,
    },
  };
}

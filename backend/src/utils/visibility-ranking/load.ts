import { and, eq, gt, inArray, lte, sql } from "drizzle-orm";
import { db } from "../../db";
import { listing_cycles, order_reviews, sellers_product, sellers_profile, user } from "../../db/schema";
import { reviewCounts } from "../../utils/trust/review-counts";
import { createVisibilityCriteria } from "../ahp-topsis";

const hourMs = 60 * 60 * 1000;
// A seller with no reviews yet gets the middle of the 1 to 5 scale.
const neutralRating = 2.5;

export type EligibleVisibilityCandidate = {
  id: string;
  cycleId: string;
  productId: string;
  sellerId: string;
  productName: string;
  productType: string;
  unit: string;
  sellerName: string;
  shopName: string;
  publishedAt: Date;
  price: string;
  quantity: string;
  originalQuantity: string;
  criteria: ReturnType<typeof createVisibilityCriteria>;
};

function hasPublicSellerProfile(row: {
  sellerActive: boolean;
  sellerVerified: boolean;
  sellerRoles: string[] | null;
  shopName: string;
  detailAddress: string;
  phoneNumber: string | null;
  latitude: number | null;
  longitude: number | null;
}) {
  return row.sellerActive && row.sellerVerified && row.sellerRoles?.includes("seller") &&
    row.shopName.trim().length > 0 && row.detailAddress.trim().length > 0 &&
    (row.phoneNumber?.trim().length ?? 0) >= 7 && row.latitude !== null &&
    Number.isFinite(row.latitude) && row.latitude >= -90 && row.latitude <= 90 &&
    row.longitude !== null && Number.isFinite(row.longitude) &&
    row.longitude >= -180 && row.longitude <= 180;
}

export async function loadEligibleVisibilityCandidates(evaluatedAt: Date) {
  const latestCycleStartedAt = sql`(
    select max(current_cycle.started_at)
    from listing_cycles as current_cycle
    where current_cycle.product_id = ${sellers_product.id}
      and current_cycle.started_at <= ${evaluatedAt}
  )`;
  const rows = await db.select({
    cycleId: listing_cycles.id,
    productId: sellers_product.id,
    sellerId: sellers_product.userId,
    productName: sellers_product.productName,
    productType: sellers_product.productType,
    unit: sellers_product.scalingType,
    sellerName: user.name,
    sellerActive: user.isActive,
    sellerVerified: user.emailVerified,
    sellerRoles: user.role,
    shopName: sellers_profile.shopName,
    detailAddress: sellers_profile.detailAddress,
    phoneNumber: sellers_profile.phoneNumber,
    latitude: sellers_profile.latitude,
    longitude: sellers_profile.longitude,
    publishedAt: sellers_product.publishedAt,
    price: sellers_product.productPrice,
    basePrice: sellers_product.basePrice,
    quantity: sellers_product.productQty,
    // Same original stock the buyer feed uses; the cycle value does not grow when a seller adds more stock.
    originalQuantity: sql<string>`coalesce(${sellers_product.originalQty}, ${listing_cycles.originalQty})`,
  }).from(listing_cycles)
    .innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId))
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, and(
      eq(sellers_profile.userId, user.id),
      eq(sellers_profile.isCurrent, true),
    ))
    .where(and(
      eq(listing_cycles.startedAt, latestCycleStartedAt),
      lte(listing_cycles.startedAt, evaluatedAt),
      eq(sellers_product.isActive, true),
      eq(sellers_product.isMarketable, true),
      gt(sellers_product.productQty, "0"),
      gt(sellers_product.productPrice, "0"),
      lte(sellers_product.publishedAt, evaluatedAt),
      eq(user.isActive, true),
      eq(user.emailVerified, true),
    ));
  const publicRows = rows.filter((row) => row.publishedAt && row.price && row.quantity &&
    Number(row.quantity) > 0 && Number(row.price) > 0 && Number(row.originalQuantity) > 0 &&
    hasPublicSellerProfile(row));
  if (!publicRows.length) return [];

  const sellerIds = [...new Set(publicRows.map((row) => row.sellerId))];
  // The seller's trust rating: the average of the service stars. Product stars are not part of it.
  const ratings = await db.select({
    sellerId: order_reviews.sellerId,
    reliability: sql<number>`avg(${order_reviews.rating})::double precision`,
  }).from(order_reviews).where(and(inArray(order_reviews.sellerId, sellerIds), reviewCounts)).groupBy(order_reviews.sellerId);
  const ratingsBySeller = new Map(ratings.map((rating) => [rating.sellerId, Number(rating.reliability ?? neutralRating)]));

  return publicRows.map((row) => {
    return {
      id: row.cycleId,
      cycleId: row.cycleId,
      productId: row.productId,
      sellerId: row.sellerId,
      productName: row.productName,
      productType: row.productType,
      unit: row.unit,
      sellerName: row.sellerName,
      shopName: row.shopName,
      publishedAt: row.publishedAt!,
      price: row.price!,
      quantity: row.quantity!,
      originalQuantity: row.originalQuantity,
      criteria: createVisibilityCriteria({
        ageHours: (evaluatedAt.getTime() - row.publishedAt!.getTime()) / hourMs,
        basePrice: row.basePrice === null ? null : Number(row.basePrice),
        price: Number(row.price),
        stock: Number(row.quantity),
        sellerRating: ratingsBySeller.get(row.sellerId) ?? neutralRating,
      }),
    } satisfies EligibleVisibilityCandidate;
  });
}

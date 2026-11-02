import { and, eq, gte, gt, inArray, lte, sql } from "drizzle-orm";
import { db } from "../../db";
import { listing_cycles, order_reviews, product_reviews, sellers_product, sellers_profile, user } from "../../db/schema";
import { createVisibilityCriteria } from "../ahp-topsis";
import { getVegetableCycleIdentity, normalizeVegetableName } from "../vegetable-identity";

const hourMs = 60 * 60 * 1000;
const dayMs = 24 * hourMs;

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
  const since = new Date(evaluatedAt.getTime() - 30 * dayMs);
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
    quantity: sellers_product.productQty,
    // Same original stock the buyer feed uses; the cycle value does not grow when a seller adds more stock.
    originalQuantity: sql<string>`coalesce(${sellers_product.originalQty}, ${listing_cycles.originalQty})`,
    cycleVegetableCatalogId: listing_cycles.vegetableCatalogId,
    cycleVegetableKey: listing_cycles.vegetableKey,
    cycleScalingType: listing_cycles.scalingType,
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
  const [ratings, cycles] = await Promise.all([
    // Same ratings the trust score reads: order ratings and product ratings together.
    db.select({
      sellerId: sql<string>`seller_id`,
      reliability: sql<number>`avg(rating)::double precision / 5.0`,
    }).from(sql`(
      select ${order_reviews.sellerId} as seller_id, ${order_reviews.rating} as rating from ${order_reviews}
      union all
      select ${product_reviews.sellerId} as seller_id, ${product_reviews.rating} as rating from ${product_reviews}
    ) as seller_ratings`).where(inArray(sql`seller_id`, sellerIds)).groupBy(sql`seller_id`),
    db.select({
      id: listing_cycles.id,
      sellerId: sellers_product.userId,
      vegetableCatalogId: listing_cycles.vegetableCatalogId,
      scalingType: listing_cycles.scalingType,
      vegetableKey: listing_cycles.vegetableKey,
      startedAt: listing_cycles.startedAt,
    }).from(listing_cycles)
      .innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId))
      .where(and(
        inArray(sellers_product.userId, sellerIds),
        gte(listing_cycles.startedAt, since),
        lte(listing_cycles.startedAt, evaluatedAt),
      )),
  ]);
  const ratingsBySeller = new Map(ratings.map((rating) => [rating.sellerId, Number(rating.reliability ?? 0.5)]));

  return publicRows.map((row) => {
    const identity = getVegetableCycleIdentity(
      row.cycleVegetableCatalogId,
      row.cycleVegetableKey || normalizeVegetableName(row.productName),
      row.cycleScalingType,
    );
    const priorCycles = cycles.filter((cycle) =>
      cycle.sellerId === row.sellerId && cycle.startedAt < row.publishedAt! &&
      getVegetableCycleIdentity(cycle.vegetableCatalogId, cycle.vegetableKey, cycle.scalingType) === identity,
    ).length;
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
        stockRatio: Number(row.quantity) / Number(row.originalQuantity),
        sellerReliability: ratingsBySeller.get(row.sellerId) ?? 0.5,
        priorCycles,
      }),
    } satisfies EligibleVisibilityCandidate;
  });
}

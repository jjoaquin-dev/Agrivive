import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db";
import { listing_cycles, sellers_product, sellers_profile, user } from "../../db/schema";
import { normalizeVegetableName } from "../vegetable-identity";
import { calculateVisibilityScore } from "../visibility-score";

const hour = 60 * 60 * 1000;

function marketplaceUrl(productId: string) {
  const base = (process.env.WEB_APP_URL ?? process.env.WEB_TRUSTED_ORIGINS?.split(",")[0] ?? "")
    .trim().replace(/\/$/, "");
  const path = `/marketplace/${productId}`;
  try { return base ? new URL(path, base).toString() : path; }
  catch { return path; }
}

export async function getPriorityPromotionEligibility(listingCycleId: string) {
  const [row] = await db.select({
    cycleId: listing_cycles.id,
    cycleStartedAt: listing_cycles.startedAt,
    cycleVegetableKey: listing_cycles.vegetableKey,
    sellerId: sellers_product.userId,
    productId: sellers_product.id,
    productName: sellers_product.productName,
    productType: sellers_product.productType,
    unit: sellers_product.scalingType,
    publishedAt: sellers_product.publishedAt,
    quantity: sellers_product.productQty,
    originalQuantity: sellers_product.originalQty,
    price: sellers_product.productPrice,
    isActive: sellers_product.isActive,
    isMarketable: sellers_product.isMarketable,
    sellerActive: user.isActive,
    sellerVerified: user.emailVerified,
    sellerRoles: user.role,
    sellerName: user.name,
    shopName: sellers_profile.shopName,
    detailAddress: sellers_profile.detailAddress,
    phoneNumber: sellers_profile.phoneNumber,
    latitude: sellers_profile.latitude,
    longitude: sellers_profile.longitude,
  }).from(listing_cycles)
    .innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId))
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .innerJoin(sellers_profile, and(
      eq(sellers_profile.userId, user.id),
      eq(sellers_profile.isCurrent, true),
    ))
    .where(eq(listing_cycles.id, listingCycleId)).limit(1);

  if (!row) return null;
  const evaluatedAt = new Date();
  const currentCycle = await db.select({ id: listing_cycles.id })
    .from(listing_cycles)
    .where(and(
      eq(listing_cycles.productId, row.productId),
      lte(listing_cycles.startedAt, evaluatedAt),
    ))
    .orderBy(desc(listing_cycles.startedAt)).limit(1);
  const isCurrentCycle = currentCycle[0]?.id === row.cycleId;
  const quantity = Number(row.quantity);
  const originalQuantity = Number(row.originalQuantity);
  const publicSeller = row.sellerActive && row.sellerVerified &&
    row.sellerRoles?.includes("seller") && row.shopName.trim().length > 0 &&
    row.detailAddress.trim().length > 0 && (row.phoneNumber?.trim().length ?? 0) >= 7 &&
    row.latitude !== null && Number.isFinite(row.latitude) && row.latitude >= -90 && row.latitude <= 90 &&
    row.longitude !== null && Number.isFinite(row.longitude) && row.longitude >= -180 && row.longitude <= 180;
  const marketable = row.isActive && row.isMarketable && Number(row.price) > 0 && quantity > 0;

  if (!isCurrentCycle || !publicSeller || !marketable || !row.publishedAt ||
    !Number.isFinite(originalQuantity) || originalQuantity <= 0) {
    return {
      eligible: false as const,
      reason: !isCurrentCycle ? "Listing cycle is no longer current" : "Listing is not currently public and buyable",
      listingCycleId: row.cycleId,
      sellerId: row.sellerId,
      productId: row.productId,
      visibilityScore: null,
      policyVersion: "visibility-v4" as const,
    };
  }

  const since = new Date(evaluatedAt.getTime() - 30 * 24 * hour);
  const cycles = await db.select({
    id: listing_cycles.id,
    productId: listing_cycles.productId,
    vegetableKey: listing_cycles.vegetableKey,
    startedAt: listing_cycles.startedAt,
  }).from(listing_cycles)
    .innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId))
    .where(and(
      eq(sellers_product.userId, row.sellerId),
      gte(listing_cycles.startedAt, since),
      lte(listing_cycles.startedAt, evaluatedAt),
    ));
  const recentCurrent = cycles.filter((cycle) => cycle.productId === row.productId &&
    cycle.startedAt <= evaluatedAt).sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];
  const vegetableKey = recentCurrent && row.publishedAt &&
    Math.abs(recentCurrent.startedAt.getTime() - row.publishedAt.getTime()) <= 60_000
    ? recentCurrent.vegetableKey
    : normalizeVegetableName(row.productName);
  const priorCycles = cycles.filter((cycle) => cycle.vegetableKey === vegetableKey &&
    cycle.startedAt < row.publishedAt! && cycle.id !== recentCurrent?.id).length;
  const visibility = calculateVisibilityScore({
    evaluatedAt,
    publishedAt: row.publishedAt,
    quantity,
    originalQuantity,
    priorCycles,
  });

  if (!visibility || visibility.score < 0.70) {
    return {
      eligible: false as const,
      reason: "Visibility is below Priority Boost",
      listingCycleId: row.cycleId,
      sellerId: row.sellerId,
      productId: row.productId,
      visibilityScore: visibility ? Number(visibility.score.toFixed(4)) : null,
      visibilityTier: visibility?.tier ?? null,
      policyVersion: "visibility-v4" as const,
    };
  }

  return {
    eligible: true as const,
    reason: null,
    listingCycleId: row.cycleId,
    sellerId: row.sellerId,
    productId: row.productId,
    visibilityScore: Number(visibility.score.toFixed(4)),
    visibilityTier: visibility.tier,
    policyVersion: "visibility-v4" as const,
    productName: row.productName,
    productType: row.productType,
    unit: row.unit,
    price: row.price,
    quantity: row.quantity,
    shopName: row.shopName,
    sellerName: row.sellerName,
    listingUrl: marketplaceUrl(row.productId),
  };
}

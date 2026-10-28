import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "../../db";
import { listing_cycles, sellers_product, sellers_profile, user } from "../../db/schema";
import { rankVisibilityCandidates, type VisibilityTier } from "../visibility-ranking";
import { loadEligibleVisibilityCandidates } from "../visibility-ranking/load";

function marketplaceUrl(productId: string) {
  const base = (process.env.WEB_APP_URL ?? process.env.WEB_TRUSTED_ORIGINS?.split(",")[0] ?? "")
    .trim().replace(/\/$/, "");
  const path = `/marketplace/${productId}`;
  try { return base ? new URL(path, base).toString() : path; }
  catch { return path; }
}

export type PromotionEligibilityOptions = {
  stage?: "initial" | "followup";
  allowActiveListing?: boolean;
};

export async function getPriorityPromotionEligibility(
  listingCycleId: string,
  options?: PromotionEligibilityOptions,
) {
  const evaluatedAt = new Date();
  const [target] = await db.select({
    cycleId: listing_cycles.id,
    productId: sellers_product.id,
    sellerId: sellers_product.userId,
    productName: sellers_product.productName,
    productType: sellers_product.productType,
    unit: sellers_product.scalingType,
    price: sellers_product.productPrice,
    quantity: sellers_product.productQty,
    originalQuantity: listing_cycles.originalQty,
    isActive: sellers_product.isActive,
    isMarketable: sellers_product.isMarketable,
    publishedAt: sellers_product.publishedAt,
    priceReductionPeriodsApplied: sellers_product.priceReductionPeriodsApplied,
    shopName: sellers_profile.shopName,
    sellerName: user.name,
  }).from(listing_cycles)
    .innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId))
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .leftJoin(sellers_profile, and(
      eq(sellers_profile.userId, user.id),
      eq(sellers_profile.isCurrent, true),
    ))
    .where(eq(listing_cycles.id, listingCycleId)).limit(1);
  if (!target) return null;

  if (!target.isActive || !target.isMarketable || Number(target.quantity ?? 0) <= 0 || Number(target.price ?? 0) <= 0) {
    return ineligible(target, "Listing is not currently public and buyable", evaluatedAt);
  }

  const currentCycle = await db.select({ id: listing_cycles.id }).from(listing_cycles)
    .where(and(eq(listing_cycles.productId, target.productId), lte(listing_cycles.startedAt, evaluatedAt)))
    .orderBy(desc(listing_cycles.startedAt)).limit(1);
  const activeCycleId = currentCycle[0]?.id ?? target.cycleId;

  const isPriceReduced = (target.priceReductionPeriodsApplied ?? 0) >= 1 || options?.stage === "followup";
  const isInitialEligible = options?.stage === "initial" || options?.allowActiveListing === true;

  let candidates: Awaited<ReturnType<typeof loadEligibleVisibilityCandidates>> = [];
  let ranking: ReturnType<typeof rankVisibilityCandidates> | null = null;
  let candidate: (typeof candidates)[number] | undefined;
  let result: NonNullable<ReturnType<typeof rankVisibilityCandidates>>["results"][number] | undefined;

  if (!isPriceReduced && !isInitialEligible) {
    candidates = await loadEligibleVisibilityCandidates(evaluatedAt);
    ranking = rankVisibilityCandidates(candidates);
    candidate = candidates.find((item) => item.cycleId === activeCycleId || item.cycleId === listingCycleId);
    result = ranking.results.find((item) => item.id === activeCycleId || item.id === listingCycleId);
  }
  const isPriorityScore = result ? result.score >= 0.60 : false;

  const shared = {
    cycleId: activeCycleId,
    sellerId: target.sellerId,
    productId: target.productId,
    visibilityScore: result ? Number(result.score.toFixed(4)) : 0.50,
    visibilityTier: (result?.tier ?? "Priority Boost") as VisibilityTier,
    visibilityRank: result?.rank ?? 1,
    policyVersion: ranking?.policyVersion ?? "visibility-ahptopsis-v1",
    evaluatedAt,
    productName: candidate?.productName ?? target.productName,
    productType: candidate?.productType ?? target.productType,
    unit: candidate?.unit ?? target.unit,
    price: candidate?.price ?? target.price,
    quantity: candidate?.quantity ?? target.quantity,
    originalQuantity: candidate?.originalQuantity ?? target.originalQuantity ?? target.quantity,
    availability: Number(target.quantity) > 0 ? ("available" as const) : ("sold_out" as const),
    shopName: candidate?.shopName ?? target.shopName ?? "Agrivive Shop",
    sellerName: candidate?.sellerName ?? target.sellerName ?? "Seller",
    listingUrl: marketplaceUrl(target.productId),
    criteria: result?.criteria ?? null,
    priceReductionPeriodsApplied: target.priceReductionPeriodsApplied ?? 0,
  } as const;

  if (!isPriorityScore && !isPriceReduced && !isInitialEligible) {
    return { eligible: false as const, reason: "Visibility is below Priority Boost", ...shared };
  }

  return {
    eligible: true as const,
    reason: null,
    ...shared,
  };
}

function ineligible(
  target: { cycleId: string; sellerId: string; productId: string },
  reason: string,
  evaluatedAt: Date,
) {
  return {
    eligible: false as const,
    reason,
    listingCycleId: target.cycleId,
    sellerId: target.sellerId,
    productId: target.productId,
    visibilityScore: null,
    visibilityTier: null,
    visibilityRank: null,
    policyVersion: "visibility-ahptopsis-v1" as const,
    evaluatedAt,
  };
}

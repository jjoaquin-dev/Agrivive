import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "../../db";
import { listing_cycles, sellers_product } from "../../db/schema";
import { rankVisibilityCandidates, type VisibilityTier } from "../visibility-ranking";
import { loadEligibleVisibilityCandidates } from "../visibility-ranking/load";

function marketplaceUrl(productId: string) {
  const base = (process.env.WEB_APP_URL ?? process.env.WEB_TRUSTED_ORIGINS?.split(",")[0] ?? "")
    .trim().replace(/\/$/, "");
  const path = `/marketplace/${productId}`;
  try { return base ? new URL(path, base).toString() : path; }
  catch { return path; }
}

type PromotionEligibilityResult = {
  eligible: false;
  reason: string | null;
  listingCycleId: string;
  sellerId: string;
  productId: string;
  visibilityScore: number | null;
  visibilityTier: VisibilityTier | null;
  visibilityRank: number | null;
  policyVersion: "visibility-ahptopsis-v1";
  evaluatedAt: Date;
};

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
    priceReductionPeriodsApplied: sellers_product.priceReductionPeriodsApplied,
  }).from(listing_cycles)
    .innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId))
    .where(eq(listing_cycles.id, listingCycleId)).limit(1);
  if (!target) return null;

  const currentCycle = await db.select({ id: listing_cycles.id }).from(listing_cycles)
    .where(and(eq(listing_cycles.productId, target.productId), lte(listing_cycles.startedAt, evaluatedAt)))
    .orderBy(desc(listing_cycles.startedAt)).limit(1);
  const activeCycleId = currentCycle[0]?.id ?? target.cycleId;

  const candidates = await loadEligibleVisibilityCandidates(evaluatedAt);
  const ranking = rankVisibilityCandidates(candidates);
  const candidate = candidates.find((item) => item.cycleId === activeCycleId || item.cycleId === listingCycleId);
  const result = ranking.results.find((item) => item.id === activeCycleId || item.id === listingCycleId);
  if (!candidate || !result) {
    return ineligible(target, "Listing is not currently public and buyable", evaluatedAt);
  }

  const isPriceReduced = (target.priceReductionPeriodsApplied ?? 0) >= 1 || options?.stage === "followup" || options?.allowActiveListing === true;
  const isPriorityScore = result.score >= 0.60;

  const shared = {
    ...target,
    cycleId: activeCycleId,
    visibilityScore: Number(result.score.toFixed(4)),
    visibilityTier: result.tier,
    visibilityRank: result.rank,
    policyVersion: ranking.policyVersion,
    evaluatedAt,
    productName: candidate.productName,
    productType: candidate.productType,
    unit: candidate.unit,
    price: candidate.price,
    quantity: candidate.quantity,
    originalQuantity: candidate.originalQuantity,
    availability: Number(candidate.quantity) > 0 ? ("available" as const) : ("sold_out" as const),
    shopName: candidate.shopName,
    sellerName: candidate.sellerName,
    listingUrl: marketplaceUrl(candidate.productId),
    criteria: result.criteria,
    priceReductionPeriodsApplied: target.priceReductionPeriodsApplied ?? 0,
  } as const;
  if (!isPriorityScore && !isPriceReduced) {
    return { eligible: false as const, reason: "Visibility is below Priority Boost", ...shared };
  }

  return {
    eligible: true as const,
    reason: null,
    ...shared,
  };
}

function ineligible(
  target: { cycleId: string; sellerId: string; productId: string; priceReductionPeriodsApplied?: number },
  reason: string,
  evaluatedAt: Date,
): PromotionEligibilityResult {
  return {
    eligible: false,
    reason,
    listingCycleId: target.cycleId,
    sellerId: target.sellerId,
    productId: target.productId,
    visibilityScore: null,
    visibilityTier: null,
    visibilityRank: null,
    policyVersion: "visibility-ahptopsis-v1",
    evaluatedAt,
  };
}

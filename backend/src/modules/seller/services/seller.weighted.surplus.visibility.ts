import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { rankVisibilityCandidates } from "../../../utils/visibility-ranking";
import { loadEligibleVisibilityCandidates } from "../../../utils/visibility-ranking/load";

export async function getSellerWeightedSurplusVisibility(sellerId: string) {
  const products = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    return tx.select().from(sellers_product).where(eq(sellers_product.userId, sellerId));
  });
  const evaluatedAt = new Date();
  const candidates = await loadEligibleVisibilityCandidates(evaluatedAt);
  const ranking = rankVisibilityCandidates(candidates);
  const candidatesByProduct = new Map(candidates.map((candidate) => [candidate.productId, candidate]));
  const resultsByCycle = new Map(ranking.results.map((result) => [result.id, result]));

  return products.map((product) => {
    const candidate = candidatesByProduct.get(product.id);
    const result = candidate ? resultsByCycle.get(candidate.cycleId) : null;
    const base = {
      productId: product.id,
      evaluatedAt: evaluatedAt.toISOString(),
      policyVersion: ranking.policyVersion,
    };
    if (!candidate || !result) {
      let reason = "Listing is not eligible";
      if (!product.isActive) {
        reason = "Listing is archived / inactive";
      } else if (!product.isMarketable) {
        reason = "Listing is marked not marketable";
      } else if (Number(product.productQty) <= 0) {
        reason = "Stock is zero";
      } else if (Number(product.productPrice) <= 0) {
        reason = "Price must be greater than zero";
      }
      return { ...base, score: null, tier: null, rank: null, reason };
    }
    const tierNormalized = result.tier.toLowerCase().includes("priority")
      ? "priority"
      : result.tier.toLowerCase().includes("standard")
      ? "standard"
      : "basic";
    return {
      ...base,
      score: Number(result.score.toFixed(4)),
      tier: tierNormalized,
      rank: result.rank,
      criteria: result.criteria,
      inputs: {
        postingAge: result.criteria.freshness,
        remainingQuantity: result.criteria.stockAvailability,
        sellerReliability: result.criteria.sellerReliability,
        recurrence: result.criteria.recurrence,
        priorCycles: Math.round(result.criteria.recurrence * 3),
        vegetableKey: candidate.productName,
      },
      distances: {
        toIdeal: Number(result.distanceToIdeal.toFixed(4)),
        toWorst: Number(result.distanceToWorst.toFixed(4)),
      },
    };
  });
}


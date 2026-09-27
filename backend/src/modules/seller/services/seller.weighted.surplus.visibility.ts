import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { normalizeVegetableName } from "../../../utils/vegetable-identity";
import { calculateVisibilityScore } from "../../../utils/visibility-score";

export async function getSellerWeightedSurplusVisibility(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const evaluatedAt = new Date();
    const since = new Date(evaluatedAt.getTime() - 30 * 24 * 60 * 60 * 1000);
    const products = await tx.select().from(sellers_product).where(eq(sellers_product.userId, sellerId));
    const cycles = products.length ? await tx.select().from(listing_cycles).where(and(
      inArray(listing_cycles.productId, products.map((product) => product.id)),
      gte(listing_cycles.startedAt, since),
      lte(listing_cycles.startedAt, evaluatedAt),
    )) : [];

    return products.map((product) => {
      const quantity = Number(product.productQty);
      const original = Number(product.originalQty);
      const eligible = product.isActive && product.isMarketable && quantity > 0;
      const base = {
        productId: product.id,
        evaluatedAt: evaluatedAt.toISOString(),
        policyVersion: "visibility-v4",
      };
      if (!eligible) {
        return { ...base, score: null, tier: null, reason: "Listing is not eligible" };
      }
      if (!Number.isFinite(original) || original <= 0 || !product.publishedAt ||
        product.publishedAt > evaluatedAt) {
        return { ...base, score: null, tier: null, reason: "Missing score inputs" };
      }

      const currentCycle = cycles
        .filter((cycle) => cycle.productId === product.id)
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];
      const vegetableKey = currentCycle &&
        Math.abs(currentCycle.startedAt.getTime() - product.publishedAt.getTime()) <= 60_000
        ? currentCycle.vegetableKey
        : normalizeVegetableName(product.productName);
      const priorCycles = cycles.filter((cycle) =>
        cycle.vegetableKey === vegetableKey &&
        cycle.startedAt < product.publishedAt! &&
        cycle.id !== currentCycle?.id,
      ).length;
      const visibility = calculateVisibilityScore({
        evaluatedAt,
        publishedAt: product.publishedAt,
        quantity,
        originalQuantity: original,
        priorCycles,
      });
      if (!visibility) return { ...base, score: null, tier: null, reason: "Missing score inputs" };

      return {
        ...base,
        score: Number(visibility.score.toFixed(4)),
        tier: visibility.tier,
        inputs: { ...visibility.inputs, vegetableKey },
      };
    });
  });
}

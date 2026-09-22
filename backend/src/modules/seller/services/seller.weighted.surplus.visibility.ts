import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { normalizeVegetableName } from "../../../utils/vegetable-identity";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const hour = 60 * 60 * 1000;
const day = 24 * hour;

export async function getSellerWeightedSurplusVisibility(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const evaluatedAt = new Date();
    const since = new Date(evaluatedAt.getTime() - 30 * day);
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
        policyVersion: "visibility-v2",
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
      const postingAge = clamp((evaluatedAt.getTime() - product.publishedAt.getTime()) / (12 * hour));
      const remainingQuantity = clamp(quantity / original);
      const inventoryAge = clamp((evaluatedAt.getTime() - product.publishedAt.getTime()) / (3 * day));
      const recurrence = clamp(priorCycles / 3);
      const score = .30 * postingAge + .30 * remainingQuantity +
        .25 * inventoryAge + .15 * recurrence;

      return {
        ...base,
        score: Number(score.toFixed(4)),
        tier: score >= .70 ? "priority" : score >= .40 ? "standard" : "basic",
        inputs: { postingAge, remainingQuantity, inventoryAge, recurrence, priorCycles, vegetableKey },
      };
    });
  });
}

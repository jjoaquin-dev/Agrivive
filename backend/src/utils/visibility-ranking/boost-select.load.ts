import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { seller_visibility_boosts, sellers_product } from "../../db/schema";
import { loadEligibleVisibilityCandidates } from "./load";
import { rankVisibilityCandidates } from "./index";
import { pickBoostCandidate } from "./boost-select";

/** Rank every eligible listing with AHP-TOPSIS, then apply the six-hour rule. Read only. */
export async function selectNextBoost(
  now = new Date(),
  skipIds: ReadonlySet<string> = new Set(),
  options: { autoPostOnly?: boolean } = {},
) {
  const candidates = await loadEligibleVisibilityCandidates(now);
  const ranking = rankVisibilityCandidates(candidates);
  const productByCycle = new Map(candidates.map((candidate) => [candidate.id, candidate.productId]));

  // Latest boost per listing. A follow-up that is due but has not run yet keeps the listing locked until it has.
  const boosts = await db.select({
    productId: seller_visibility_boosts.productId,
    createdAt: seller_visibility_boosts.createdAt,
    followUpDueAt: seller_visibility_boosts.followUpDueAt,
  }).from(seller_visibility_boosts).where(and(
    eq(seller_visibility_boosts.reason, "initial"),
    inArray(seller_visibility_boosts.status, ["queued", "sent"]),
  )).orderBy(asc(seller_visibility_boosts.createdAt));
  const lastBoostAtByProduct = new Map<string, Date>();
  for (const boost of boosts) {
    const followUpPending = boost.followUpDueAt !== null && boost.followUpDueAt <= now;
    lastBoostAtByProduct.set(boost.productId, followUpPending ? now : boost.createdAt);
  }

  // Automatic rounds only touch listings whose seller said yes to auto-post and already made the first post by hand.
  let skip = skipIds;
  if (options.autoPostOnly) {
    const allowed = new Set((await db.select({ id: sellers_product.id }).from(sellers_product)
      .where(eq(sellers_product.autoPostEnabled, true))).map((row) => row.id));
    const firstPosted = new Set(boosts.map((boost) => boost.productId));
    skip = new Set([...skipIds, ...candidates
      .filter((candidate) => !allowed.has(candidate.productId) || !firstPosted.has(candidate.productId))
      .map((candidate) => candidate.id)]);
  }

  const picked = pickBoostCandidate(ranking.results.map((result) => ({
    id: result.id, productId: productByCycle.get(result.id)!, rank: result.rank, score: result.score,
  })), lastBoostAtByProduct, now, skip);
  const sellerByCycle = new Map(candidates.map((candidate) => [candidate.id, candidate.sellerId]));
  return { sellerByCycle, weights: ranking.weights, consistencyRatio: ranking.consistencyRatio, ranking: ranking.results, ...picked };
}

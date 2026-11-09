import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "../db";
import { seller_visibility_boosts } from "../db/schema";
import { queueSellerVisibilityBoost } from "../modules/seller/services/seller.visibility-boost.queue";
import { selectNextBoost } from "../utils/visibility-ranking/boost-select.load";

const maxTries = 5;
const minuteMs = 60_000;

/**
 * Boost ranking flow: rank with AHP-TOPSIS, take the top-ranked listing that is not locked
 * (6 hours since its last boost), queue its boost. The normal boost delivery then POSTs to n8n
 * ("1. Boost Confirmed", initial) and the follow-up job POSTs again 6 hours later.
 * Only listings whose seller turned on auto-post, after the seller's own first post. Off unless AUTO_BOOST_ENABLED=true. One boost per round (AUTO_BOOST_ROUND_MINUTES, default 60).
 */
export async function queueRankedBoost(now = new Date()) {
  if (process.env.AUTO_BOOST_ENABLED?.trim().toLowerCase() !== "true") return { enabled: false, queued: null };
  const roundMinutes = Math.max(1, Number(process.env.AUTO_BOOST_ROUND_MINUTES) || 60);
  const [recent] = await db.select({ id: seller_visibility_boosts.id }).from(seller_visibility_boosts).where(and(
    eq(seller_visibility_boosts.reason, "initial"),
    gte(seller_visibility_boosts.createdAt, new Date(now.getTime() - roundMinutes * minuteMs)),
  )).orderBy(desc(seller_visibility_boosts.createdAt)).limit(1);
  if (recent) return { enabled: true, queued: null, waiting: true };

  const tried = new Set<string>();
  for (let attempt = 0; attempt < maxTries; attempt += 1) {
    const { chosen, sellerByCycle } = await selectNextBoost(now, tried, { autoPostOnly: true });
    if (!chosen) return { enabled: true, queued: null };
    tried.add(chosen.id);
    try {
      const boost = await queueSellerVisibilityBoost(sellerByCycle.get(chosen.id)!, chosen.productId, { nextRound: true });
      return { enabled: true, queued: boost.boostId, productId: chosen.productId, score: chosen.score };
    } catch (error) {
      // Not boostable right now (no photo, still locked, ...): try the next-ranked one.
      console.warn("Ranked boost skipped", { productId: chosen.productId, error: error instanceof Error ? error.message : error });
    }
  }
  return { enabled: true, queued: null };
}

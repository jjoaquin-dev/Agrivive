import { and, desc, eq, inArray, isNotNull, lt, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { listing_cycles, seller_visibility_boosts as boosts, sellers_product as products } from "../db/schema";
import { getBoostWebhookTarget } from "./boost-webhook-target";

const maxAttempts = 5;
const retryAfterMs = 15 * 60_000;
const batchSize = 50;

/** Why the rule is over for this boost, or null while a price cut is still possible. */
async function endedReason(boost: {
  listingCycleId: string; productId: string; enabled: boolean; active: boolean; marketable: boolean;
  quantity: string | null; amount: string | null; minimumPrice: string | null; price: string | null;
}) {
  if (!boost.enabled || !boost.active || !boost.marketable || Number(boost.quantity ?? 0) <= 0) return "unavailable";
  if (Number(boost.amount ?? 0) <= 0 || boost.minimumPrice === null) return "not_enabled";
  if (Number(boost.price ?? 0) <= Number(boost.minimumPrice)) return "at_floor";
  const [cycle] = await db.select({ id: listing_cycles.id }).from(listing_cycles).where(and(
    eq(listing_cycles.productId, boost.productId), lte(listing_cycles.startedAt, new Date()),
  )).orderBy(desc(listing_cycles.startedAt)).limit(1);
  return !cycle || cycle.id !== boost.listingCycleId ? "new_cycle" : null;
}

/**
 * The 6-hour rule. When a first Boost post is saved, the boost gets a due time 6 hours later.
 * This job asks n8n to cut the price and post once that time passes. After each round is saved,
 * the due time is set 6 hours ahead again, until the price reaches the seller's lowest price.
 * Until a round is saved (or skipped) it asks again every 15 minutes, up to 5 times.
 * It does not call n8n when no cut is possible (sold out, archived, paused, at the lowest price,
 * or the listing started over); it just ends the rule so n8n never shows an error for it.
 */
export async function deliverSellerBoostFollowUps() {
  const webhook = getBoostWebhookTarget();
  if (!webhook) return { configured: false, due: 0, sent: 0, failed: 0 };

  const now = new Date();
  const due = await db.select({
    id: boosts.id,
    listingCycleId: boosts.listingCycleId,
    productId: boosts.productId,
    enabled: products.priceReductionEnabled,
    active: products.isActive,
    marketable: products.isMarketable,
    quantity: products.productQty,
    amount: products.priceReductionAmount,
    minimumPrice: products.minimumPrice,
    price: products.productPrice,
  }).from(boosts).innerJoin(products, eq(products.id, boosts.productId)).where(and(
    eq(boosts.reason, "initial"),
    inArray(boosts.status, ["queued", "sent"]),
    isNotNull(boosts.followUpDueAt),
    lte(boosts.followUpDueAt, now),
    lt(boosts.followUpAttempts, maxAttempts),
  )).limit(batchSize);

  let sent = 0;
  let failed = 0;
  for (const boost of due) {
    if (await endedReason(boost)) {
      await db.update(boosts).set({ followUpDueAt: null }).where(eq(boosts.id, boost.id));
      continue;
    }
    // Claiming moves the due time forward, so a second worker pass skips this boost.
    const [claimed] = await db.update(boosts).set({
      followUpDueAt: new Date(now.getTime() + retryAfterMs),
      followUpAttempts: sql`${boosts.followUpAttempts} + 1`,
    }).where(and(
      eq(boosts.id, boost.id),
      isNotNull(boosts.followUpDueAt),
      lte(boosts.followUpDueAt, now),
      lt(boosts.followUpAttempts, maxAttempts),
    )).returning({ id: boosts.id });
    if (!claimed) continue;

    try {
      const response = await fetch(webhook.target, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${webhook.serviceToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ boostId: boost.id, reason: "follow_up" }),
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) throw new Error(`n8n returned HTTP ${response.status}`);
      sent++;
    } catch (error) {
      failed++;
      console.error("Boost follow-up delivery failed", { boostId: boost.id, error });
      await db.update(boosts).set({ lastError: "n8n boost follow-up delivery failed" })
        .where(eq(boosts.id, boost.id));
    }
  }

  return { configured: true, due: due.length, sent, failed };
}

import { and, eq, inArray, isNotNull, lt, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { seller_visibility_boosts as boosts } from "../db/schema";
import { getBoostWebhookTarget } from "./boost-webhook-target";

const maxAttempts = 5;
const retryAfterMs = 15 * 60_000;
const batchSize = 50;

/**
 * The 6-hour rule. When a first Boost post is saved, the boost gets a due time.
 * This job asks n8n to run the price cut and the second post once that time passes.
 * Until the second post is saved (or the cut is skipped) it asks again every 15 minutes, up to 5 times.
 */
export async function deliverSellerBoostFollowUps() {
  const webhook = getBoostWebhookTarget();
  if (!webhook) return { configured: false, due: 0, sent: 0, failed: 0 };

  const now = new Date();
  const due = await db.select({ id: boosts.id }).from(boosts).where(and(
    eq(boosts.reason, "initial"),
    inArray(boosts.status, ["queued", "sent"]),
    isNotNull(boosts.followUpDueAt),
    lte(boosts.followUpDueAt, now),
    lt(boosts.followUpAttempts, maxAttempts),
  )).limit(batchSize);

  let sent = 0;
  let failed = 0;
  for (const boost of due) {
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

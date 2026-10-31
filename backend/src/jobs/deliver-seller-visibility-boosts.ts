import { and, eq, isNull, lte, or } from "drizzle-orm";
import { db } from "../db";
import { seller_visibility_boosts } from "../db/schema";
import { getBoostWebhookTarget } from "./boost-webhook-target";

const maxAttempts = 5;
const batchSize = 50;

function retryDelay(attempt: number) {
  return Math.min(30 * 60_000, 30_000 * (2 ** Math.max(0, attempt - 1)));
}

export async function deliverSellerVisibilityBoosts() {
  const webhook = getBoostWebhookTarget();
  if (!webhook) return { configured: false, queued: 0, sent: 0, failed: 0 };
  const { target, serviceToken } = webhook;

  const now = new Date();
  const due = await db.select({
    id: seller_visibility_boosts.id,
    reason: seller_visibility_boosts.reason,
    retryCount: seller_visibility_boosts.retryCount,
  }).from(seller_visibility_boosts).where(and(
    or(eq(seller_visibility_boosts.status, "queued"), eq(seller_visibility_boosts.status, "sent")),
    lte(seller_visibility_boosts.nextAttemptAt, now),
    or(isNull(seller_visibility_boosts.leaseUntil), lte(seller_visibility_boosts.leaseUntil, now)),
  )).limit(batchSize);

  let sent = 0;
  let failed = 0;
  for (const boost of due) {
    const [claimed] = await db.update(seller_visibility_boosts).set({
      leaseUntil: new Date(now.getTime() + 15_000),
    }).where(and(
      eq(seller_visibility_boosts.id, boost.id),
      or(eq(seller_visibility_boosts.status, "queued"), eq(seller_visibility_boosts.status, "sent")),
      lte(seller_visibility_boosts.nextAttemptAt, now),
      or(isNull(seller_visibility_boosts.leaseUntil), lte(seller_visibility_boosts.leaseUntil, now)),
    )).returning({ id: seller_visibility_boosts.id });
    if (!claimed) continue;

    try {
      const response = await fetch(target, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ boostId: boost.id, reason: boost.reason }),
        signal: AbortSignal.timeout(12_000),
      });
      const attempt = boost.retryCount + 1;
      if (!response.ok) {
        const responseBody = await response.text().catch(() => "");
        const exhausted = attempt >= maxAttempts;
        console.error("Visibility boost webhook rejected", {
          boostId: boost.id,
          status: response.status,
          response: responseBody.slice(0, 500),
        });
        await db.update(seller_visibility_boosts).set({
          status: exhausted ? "failed" : "queued",
          retryCount: attempt,
          leaseUntil: null,
          nextAttemptAt: new Date(now.getTime() + retryDelay(attempt)),
          lastError: `n8n visibility boost webhook returned HTTP ${response.status}`,
          updatedAt: now,
        }).where(eq(seller_visibility_boosts.id, boost.id));
        if (exhausted) failed++;
        continue;
      }

      await db.update(seller_visibility_boosts).set({
        status: "sent",
        retryCount: attempt,
        leaseUntil: null,
        sentAt: now,
        nextAttemptAt: new Date("2099-01-01T00:00:00.000Z"),
        lastError: null,
        updatedAt: now,
      }).where(eq(seller_visibility_boosts.id, boost.id));
      sent++;
    } catch (error) {
      const attempt = boost.retryCount + 1;
      const exhausted = attempt >= maxAttempts;
      console.error("Visibility boost webhook delivery failed", { boostId: boost.id, error });
      await db.update(seller_visibility_boosts).set({
        status: exhausted ? "failed" : "queued",
        retryCount: attempt,
        leaseUntil: null,
        nextAttemptAt: new Date(now.getTime() + retryDelay(attempt)),
        lastError: "n8n visibility boost webhook delivery failed",
        updatedAt: now,
      }).where(eq(seller_visibility_boosts.id, boost.id));
      if (exhausted) failed++;
    }
  }

  return { configured: true, queued: due.length, sent, failed };
}

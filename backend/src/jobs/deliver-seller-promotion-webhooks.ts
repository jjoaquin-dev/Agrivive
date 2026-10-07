import { and, eq, isNull, lte, or } from "drizzle-orm";
import { db } from "../db";
import { seller_promotion_jobs } from "../db/schema";

const maxAttempts = 5;
const batchSize = 50;
const draftResponseTimeoutMs = 2 * 60_000;

function retryDelay(attempt: number) {
  return Math.min(30_000 * 2 ** Math.max(0, attempt - 1), 30 * 60_000);
}

export async function deliverSellerPromotionWebhooks() {
  const webhookUrl = process.env.N8N_PROMOTION_WEBHOOK_URL?.trim();
  const serviceToken = process.env.N8N_PROMOTION_SERVICE_TOKEN?.trim();
  if (!webhookUrl || !serviceToken) return { configured: false, queued: 0, sent: 0, failed: 0 };

  let target: URL;
  try {
    target = new URL(webhookUrl);
    if (target.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(target.hostname)) {
      return { configured: false, queued: 0, sent: 0, failed: 0 };
    }
  } catch {
    return { configured: false, queued: 0, sent: 0, failed: 0 };
  }

  const now = new Date();
  const due = await db.select({
    id: seller_promotion_jobs.id,
    stage: seller_promotion_jobs.stage,
    status: seller_promotion_jobs.status,
    retryCount: seller_promotion_jobs.retryCount,
  }).from(seller_promotion_jobs).where(and(
    or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent")),
    lte(seller_promotion_jobs.nextCheckAt, now),
    or(isNull(seller_promotion_jobs.leaseUntil), lte(seller_promotion_jobs.leaseUntil, now)),
  )).limit(batchSize);

  let sent = 0;
  let failed = 0;
  for (const job of due) {
    const claimed = await db.update(seller_promotion_jobs).set({
      leaseUntil: new Date(now.getTime() + 15_000),
    }).where(and(
      eq(seller_promotion_jobs.id, job.id),
      eq(seller_promotion_jobs.status, job.status),
      lte(seller_promotion_jobs.nextCheckAt, now),
      or(isNull(seller_promotion_jobs.leaseUntil), lte(seller_promotion_jobs.leaseUntil, now)),
    )).returning({ id: seller_promotion_jobs.id });
    if (!claimed.length) continue;

    if (job.status === "sent" && job.retryCount >= maxAttempts) {
      await db.update(seller_promotion_jobs).set({
        status: "failed",
        leaseUntil: null,
        lastError: "No draft response was received after the retry limit",
        updatedAt: now,
      }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "sent")));
      failed++;
      continue;
    }

    if (job.status === "sent") {
      await db.update(seller_promotion_jobs).set({
        status: "queued",
        nextCheckAt: now,
        updatedAt: now,
      }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "sent")));
    }

    try {
      const response = await fetch(target, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ jobId: job.id, stage: job.stage }),
        signal: AbortSignal.timeout(10_000),
      });
      const attempt = job.retryCount + 1;
      if (!response.ok) {
        const exhausted = attempt >= maxAttempts;
        await db.update(seller_promotion_jobs).set({
          status: exhausted ? "failed" : "queued",
          retryCount: attempt,
          leaseUntil: null,
          nextCheckAt: new Date(now.getTime() + retryDelay(attempt)),
          lastError: `n8n webhook returned HTTP ${response.status}`,
          updatedAt: now,
        }).where(and(
          eq(seller_promotion_jobs.id, job.id),
          or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent")),
        ));
        if (exhausted) failed++;
        continue;
      }

      await db.update(seller_promotion_jobs).set({
        status: "sent",
        retryCount: attempt,
        leaseUntil: null,
        nextCheckAt: new Date(now.getTime() + draftResponseTimeoutMs),
        lastError: null,
        updatedAt: now,
      }).where(and(
        eq(seller_promotion_jobs.id, job.id),
        or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent")),
      ));
      sent++;
    } catch (error) {
      const attempt = job.retryCount + 1;
      const exhausted = attempt >= maxAttempts;
      console.error("Promotion webhook delivery failed", { jobId: job.id, stage: job.stage, error });
      await db.update(seller_promotion_jobs).set({
        status: exhausted ? "failed" : "queued",
        retryCount: attempt,
        leaseUntil: null,
        nextCheckAt: new Date(now.getTime() + retryDelay(attempt)),
        lastError: "n8n webhook delivery failed",
        updatedAt: now,
      }).where(and(
        eq(seller_promotion_jobs.id, job.id),
        or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent")),
      ));
      if (exhausted) failed++;
    }
  }

  return { configured: true, queued: due.length, sent, failed };
}

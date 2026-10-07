import { and, eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { seller_promotion_jobs } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

const retryLimit = 5;
const failureMessages = {
  model_failed: "Draft generation failed",
  invalid_draft: "Generated draft did not meet content requirements",
  callback_failed: "Draft could not be submitted to Agrivive",
} as const;

export async function recordIntegrationPromotionFailure(
  jobId: string,
  code: keyof typeof failureMessages,
) {
  const [job] = await db.select({
    id: seller_promotion_jobs.id,
    status: seller_promotion_jobs.status,
    retryCount: seller_promotion_jobs.retryCount,
  }).from(seller_promotion_jobs).where(eq(seller_promotion_jobs.id, jobId)).limit(1);
  if (!job) throw new OrderError(404, "Promotion job not found");
  if (job.status === "ready") return { jobId, status: "ready" as const, duplicate: true };
  if (job.status !== "queued" && job.status !== "sent") {
    throw new OrderError(409, "Promotion job cannot be retried");
  }

  const exhausted = job.retryCount >= retryLimit;
  const delay = Math.min(30_000 * 2 ** Math.max(0, job.retryCount - 1), 30 * 60_000);
  const [updated] = await db.update(seller_promotion_jobs).set({
    status: exhausted ? "failed" : "queued",
    leaseUntil: null,
    nextCheckAt: new Date(Date.now() + delay),
    lastError: failureMessages[code],
    updatedAt: new Date(),
  }).where(and(
    eq(seller_promotion_jobs.id, job.id),
    or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent")),
  )).returning({ status: seller_promotion_jobs.status });
  return { jobId, status: updated?.status ?? job.status, duplicate: !updated };
}

import { and, eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { seller_promotion_jobs } from "../../../db/schema";
import { getPriorityPromotionEligibility } from "../../../utils/promotion-eligibility";
import { OrderError } from "../../../utils/order-types";

export async function saveIntegrationPromotionDraft(
  jobId: string,
  headline: string,
  caption: string,
) {
  const cleanHeadline = headline.trim();
  const cleanCaption = caption.trim();
  if (!cleanHeadline || cleanHeadline.length > 80 || !cleanCaption || cleanCaption.length > 280) {
    throw new OrderError(400, "Promotion draft is not valid");
  }

  const [job] = await db.select().from(seller_promotion_jobs)
    .where(eq(seller_promotion_jobs.id, jobId)).limit(1);
  if (!job) throw new OrderError(404, "Promotion job not found");
  if (job.status === "ready") {
    return { jobId, status: job.status, readyAt: job.readyAt, duplicate: true };
  }
  if (job.status !== "queued" && job.status !== "sent") {
    throw new OrderError(409, "Promotion job is not awaiting a draft");
  }

  const eligibility = await getPriorityPromotionEligibility(job.listingCycleId);
  if (!eligibility?.eligible) {
    await db.update(seller_promotion_jobs).set({
      status: "skipped",
      lastError: eligibility?.reason ?? "Listing is no longer eligible",
      updatedAt: new Date(),
    }).where(and(
      eq(seller_promotion_jobs.id, job.id),
      or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent")),
    ));
    throw new OrderError(409, "Listing is no longer eligible for Priority Boost");
  }

  const now = new Date();
  return db.transaction(async (tx) => {
    const [saved] = await tx.update(seller_promotion_jobs).set({
      status: "ready",
      headline: cleanHeadline,
      caption: cleanCaption,
      readyAt: now,
      readAt: null,
      leaseUntil: null,
      nextCheckAt: now,
      lastError: null,
      updatedAt: now,
    }).where(and(
      eq(seller_promotion_jobs.id, job.id),
      or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent")),
    )).returning({ id: seller_promotion_jobs.id, readyAt: seller_promotion_jobs.readyAt });

    if (!saved) {
      const [current] = await tx.select({
        status: seller_promotion_jobs.status,
        readyAt: seller_promotion_jobs.readyAt,
      }).from(seller_promotion_jobs).where(eq(seller_promotion_jobs.id, job.id)).limit(1);
      if (current?.status === "ready") {
        return { jobId, status: current.status, readyAt: current.readyAt, duplicate: true };
      }
      throw new OrderError(409, "Promotion job changed before the draft was saved");
    }

    if (job.stage === "initial") {
      const followupAt = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      await tx.insert(seller_promotion_jobs).values({
        listingCycleId: job.listingCycleId,
        productId: job.productId,
        sellerId: job.sellerId,
        stage: "followup",
        status: "waiting",
        nextCheckAt: followupAt,
      }).onConflictDoNothing();
    }
    return { jobId, status: "ready" as const, readyAt: saved.readyAt, duplicate: false };
  });
}

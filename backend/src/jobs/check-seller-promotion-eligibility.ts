import { and, eq, isNull, lte, or } from "drizzle-orm";
import { db } from "../db";
import { listing_cycles, seller_promotion_jobs, sellers_product } from "../db/schema";
import { getPriorityPromotionEligibility } from "../utils/promotion-eligibility";

const hourMs = 60 * 60 * 1000;
const batchSize = 100;

async function addJobsForNewCycles(now: Date) {
  const unseen = await db.select({
    listingCycleId: listing_cycles.id,
    productId: sellers_product.id,
    sellerId: sellers_product.userId,
  }).from(listing_cycles)
    .innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId))
    .leftJoin(seller_promotion_jobs, and(
      eq(seller_promotion_jobs.listingCycleId, listing_cycles.id),
      eq(seller_promotion_jobs.stage, "initial"),
    ))
    .where(isNull(seller_promotion_jobs.id)).limit(batchSize);

  for (const cycle of unseen) {
    await db.insert(seller_promotion_jobs).values({
      ...cycle,
      stage: "initial",
      status: "waiting",
      nextCheckAt: now,
    }).onConflictDoNothing();
  }
  return unseen.length;
}

export async function checkSellerPromotionEligibility() {
  const now = new Date();
  const discovered = await addJobsForNewCycles(now);
  const due = await db.select({
    id: seller_promotion_jobs.id,
    listingCycleId: seller_promotion_jobs.listingCycleId,
    stage: seller_promotion_jobs.stage,
  }).from(seller_promotion_jobs).where(and(
    eq(seller_promotion_jobs.status, "waiting"),
    lte(seller_promotion_jobs.nextCheckAt, now),
    or(isNull(seller_promotion_jobs.leaseUntil), lte(seller_promotion_jobs.leaseUntil, now)),
  )).limit(batchSize);

  let queued = 0;
  let rescheduled = 0;
  let skipped = 0;
  let failed = 0;

  for (const job of due) {
    try {
      const claimed = await db.update(seller_promotion_jobs).set({
        leaseUntil: new Date(now.getTime() + 15_000),
      }).where(and(
        eq(seller_promotion_jobs.id, job.id),
        eq(seller_promotion_jobs.status, "waiting"),
        lte(seller_promotion_jobs.nextCheckAt, now),
        or(isNull(seller_promotion_jobs.leaseUntil), lte(seller_promotion_jobs.leaseUntil, now)),
      )).returning({ id: seller_promotion_jobs.id });
      if (!claimed.length) continue;

      const eligibility = await getPriorityPromotionEligibility(job.listingCycleId);
      if (!eligibility) {
        await db.update(seller_promotion_jobs).set({
          status: "skipped",
          leaseUntil: null,
          lastError: "Listing cycle is no longer available",
          updatedAt: now,
        }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting")));
        skipped++;
        continue;
      }

      if (!eligibility.eligible && eligibility.visibilityScore !== null &&
        job.stage === "initial") {
        await db.update(seller_promotion_jobs).set({
          nextCheckAt: new Date(now.getTime() + hourMs),
          leaseUntil: null,
          lastError: null,
          updatedAt: now,
        }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting")));
        rescheduled++;
        continue;
      }

      if (!eligibility.eligible) {
        await db.update(seller_promotion_jobs).set({
          status: "skipped",
          leaseUntil: null,
          lastError: eligibility.reason ?? "Listing is no longer eligible",
          updatedAt: now,
        }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting")));
        skipped++;
        continue;
      }

      const updated = await db.update(seller_promotion_jobs).set({
        status: "queued",
        nextCheckAt: now,
        leaseUntil: null,
        lastError: null,
        updatedAt: now,
      }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting")))
        .returning({ id: seller_promotion_jobs.id });
      if (updated.length) queued++;
    } catch (error) {
      console.error("Promotion eligibility check failed", { jobId: job.id, stage: job.stage, error });
      await db.update(seller_promotion_jobs).set({
        nextCheckAt: new Date(now.getTime() + hourMs),
        leaseUntil: null,
        lastError: "Eligibility check could not be completed",
        updatedAt: now,
      }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting")));
      failed++;
    }
  }

  return { discovered, checked: due.length, queued, rescheduled, skipped, failed };
}

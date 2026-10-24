import { and, eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { seller_promotion_jobs } from "../../../db/schema";
import { getPriorityPromotionEligibility } from "../../../utils/promotion-eligibility";
import { OrderError } from "../../../utils/order-types";

export async function getIntegrationPromotionContext(jobId: string) {
  const [job] = await db.select({
    id: seller_promotion_jobs.id,
    listingCycleId: seller_promotion_jobs.listingCycleId,
    stage: seller_promotion_jobs.stage,
    status: seller_promotion_jobs.status,
  }).from(seller_promotion_jobs).where(eq(seller_promotion_jobs.id, jobId)).limit(1);
  if (!job) throw new OrderError(404, "Promotion job not found");
  if (job.status === "ready") return { jobId, alreadyReady: true as const };
  if (job.status !== "queued" && job.status !== "sent") {
    throw new OrderError(409, "Promotion job is not awaiting a draft");
  }

  const context = await getPriorityPromotionEligibility(job.listingCycleId, { stage: job.stage });
  if (!context?.eligible) {
    await db.update(seller_promotion_jobs).set({
      status: "skipped",
      leaseUntil: null,
      lastError: context?.reason ?? "Listing is no longer eligible",
      completedAt: new Date(),
      updatedAt: new Date(),
    }).where(and(
      eq(seller_promotion_jobs.id, job.id),
      or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent")),
    ));
    throw new OrderError(409, "Listing is no longer eligible for Priority Boost");
  }

  await db.update(seller_promotion_jobs).set({
    visibilityPolicyVersion: context.policyVersion,
    visibilityScore: context.visibilityScore.toFixed(4),
    visibilityTier: context.visibilityTier,
    visibilityRank: context.visibilityRank,
    evaluatedAt: context.evaluatedAt,
    updatedAt: new Date(),
  }).where(and(
    eq(seller_promotion_jobs.id, job.id),
    or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent")),
  ));

  return {
    jobId,
    alreadyReady: false as const,
    stage: job.stage,
    visibilityScore: context.visibilityScore,
    visibilityTier: context.visibilityTier,
    visibilityRank: context.visibilityRank,
    policyVersion: context.policyVersion,
    evaluatedAt: context.evaluatedAt,
    product: {
      id: context.productId,
      name: context.productName,
      type: context.productType,
      unit: context.unit,
    },
    seller: {
      id: context.sellerId,
      name: context.sellerName,
      shopName: context.shopName,
    },
    listing: {
      price: context.price,
      quantity: context.quantity,
      originalQuantity: context.originalQuantity,
      availability: context.availability,
    },
    listingUrl: context.listingUrl,
  };
}

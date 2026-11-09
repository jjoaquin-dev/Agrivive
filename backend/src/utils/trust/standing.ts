import { and, count, eq, gte, isNull, sql } from "drizzle-orm";
import { db } from "../../db";
import { order_declines, seller_flags, user } from "../../db/schema";
import { faultGateMet, needsReview, readSellerFaultRate } from "./fault-rate";
import { isPauseOrBlock, levelForScore, levelRank, type TrustLevel } from "./level";
import { sellerFaultPolicy, trustScoreWindowStart } from "./policy";
import { isTrustedSeller, readSellerBayesianRating } from "./rating";
import { readTrustMonitoringScore } from "./score";

type Reader = Pick<typeof db, "select">;

export type Standing = Awaited<ReturnType<typeof readTrustStanding>>;

/**
 * The person's real trust level. A buyer's level follows the score. A seller's Pause or Block also needs
 * a fault rate of at least 10% over at least 10 orders; otherwise the seller stays at Warning and is "Under watch".
 * Confirmed QR misuse still blocks at once.
 */
export async function readTrustStanding(subjectId: string, now = new Date()) {
  const monitoring = await readTrustMonitoringScore(subjectId, now);
  const serious = monitoring.seriousViolations > 0;
  const rawLevel = levelForScore(monitoring.weightedPoints, serious);
  const [account] = await db.select({ roles: user.role }).from(user).where(eq(user.id, subjectId)).limit(1);
  const isSeller = !!account?.roles?.includes("seller");
  if (!isSeller) {
    return { subjectId, isSeller, score: monitoring.weightedPoints, serious, rawLevel, level: rawLevel, underWatch: false, needsReview: false, fault: null, rating: null, trusted: false, canBoost: true, canList: rawLevel !== "block" && !isPauseOrBlock(rawLevel), monitoring };
  }
  const fault = await readSellerFaultRate(db, subjectId, now);
  const gate = faultGateMet(fault.orderCount, fault.ratePercent);
  const gated = isPauseOrBlock(rawLevel) && !serious && !gate;
  const level: TrustLevel = gated ? "warning" : rawLevel;
  const review = needsReview(fault.orderCount, fault.ratePercent);
  const rating = await readSellerBayesianRating(db, subjectId);
  const trusted = isTrustedSeller({ rating: rating.rating, score: monitoring.weightedPoints, completedOrders: fault.completedOrders, faultRatePercent: fault.ratePercent });
  return {
    subjectId, isSeller, score: monitoring.weightedPoints, serious, rawLevel, level,
    underWatch: gated, needsReview: review, fault, rating, trusted,
    canBoost: !review && !isPauseOrBlock(level),
    canList: !isPauseOrBlock(level),
    monitoring,
  };
}

/** Keeps the seller flags in step with the numbers. */
export async function syncSellerFlags(standing: Standing, now = new Date()) {
  if (!standing.isSeller) return;
  const since = trustScoreWindowStart(now) ?? new Date(0);
  const [returns] = await db.select({ n: count() }).from(order_declines).where(and(
    eq(order_declines.sellerId, standing.subjectId), eq(order_declines.status, "seller_fault"), gte(order_declines.decidedAt, since)));
  const wanted: Record<string, string | null> = {
    under_watch: standing.underWatch ? `Score ${standing.score} but fault rate ${standing.fault?.ratePercent.toFixed(1)}% over ${standing.fault?.orderCount} orders is below the gate.` : null,
    needs_review: standing.needsReview ? `Fault rate ${standing.fault?.ratePercent.toFixed(1)}% is at or above ${sellerFaultPolicy.reviewPercent}%.` : null,
    repeat_returns: Number(returns?.n ?? 0) >= sellerFaultPolicy.repeatReturnFlag ? `${returns?.n} confirmed seller-fault returns in the last ${sellerFaultPolicyDays()} days.` : null,
  };
  for (const [kind, detail] of Object.entries(wanted)) {
    if (detail) {
      await db.insert(seller_flags).values({ sellerId: standing.subjectId, kind, detail }).onConflictDoNothing();
    } else {
      await db.update(seller_flags).set({ closedAt: now }).where(and(
        eq(seller_flags.sellerId, standing.subjectId), eq(seller_flags.kind, kind), isNull(seller_flags.closedAt)));
    }
  }
}

const sellerFaultPolicyDays = () => (trustScoreWindowStart() ? 90 : "all");


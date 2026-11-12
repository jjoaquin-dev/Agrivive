import { and, desc, eq, gte, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { seller_flags, trust_corrections, trust_disputes, trust_events } from "../../../db/schema";
import { eventCopy } from "../../../utils/trust/notice-text";
import { readActiveActions } from "../../../utils/trust/evaluate-action";
import { levelGuidance, levelLadder, nextLevelFor } from "../../../utils/trust/guidance";
import { levelLabel } from "../../../utils/trust/level";
import { sellerFaultPolicy, trustScoreWindowStart, trustedSellerPolicy } from "../../../utils/trust/policy";
import { readTrustStanding } from "../../../utils/trust/standing";
import { DISPUTE_WINDOW_DAYS } from "./trust.dispute.create";

/** One person's own trust page: score, level, what counted, what can still be disputed, and (for sellers) the fault rate and badge. */
export async function readMyTrust(userId: string) {
  const standing = await readTrustStanding(userId);
  const since = trustScoreWindowStart() ?? new Date(0);
  const events = await db.select({ id: trust_events.id, kind: trust_events.kind, weight: trust_events.weight, reason: trust_events.reason, orderId: trust_events.orderId,
    createdAt: trust_events.createdAt, invalidatedAt: trust_events.invalidatedAt, disputeStatus: trust_disputes.status, correctionId: trust_corrections.id })
    .from(trust_events).leftJoin(trust_disputes, eq(trust_disputes.eventId, trust_events.id)).leftJoin(trust_corrections, eq(trust_corrections.eventId, trust_events.id))
    .where(and(eq(trust_events.subjectId, userId), eq(trust_events.classification, "verified"), gte(trust_events.createdAt, since)))
    .orderBy(desc(trust_events.createdAt)).limit(100);
  const active = await readActiveActions(userId);
  const flags = standing.isSeller ? await db.select({ kind: seller_flags.kind, detail: seller_flags.detail, openedAt: seller_flags.openedAt })
    .from(seller_flags).where(and(eq(seller_flags.sellerId, userId), isNull(seller_flags.closedAt))) : [];
  const role = standing.isSeller ? "seller" as const : "buyer" as const;
  return {
    score: standing.score, level: standing.level, levelLabel: levelLabel[standing.level], windowDays: 90,
    guidance: levelGuidance(standing.level, role), nextLevel: nextLevelFor(standing.score, role), ladder: levelLadder(role),
    serious: "QR misuse and an order from your own account block the account at once.",
    pausedUntil: active.find((row) => row.endsAt)?.endsAt ?? null,
    activeActions: active.map((row) => ({ id: row.id, level: row.level, type: row.actionType, reason: row.reason, endsAt: row.endsAt })),
    events: events.map((row) => ({
      id: row.id, kind: row.kind, points: row.weight ?? 0, what: eventCopy[row.kind]?.what ?? "A trust event was recorded.", rule: eventCopy[row.kind]?.rule ?? "",
      orderId: row.orderId, createdAt: row.createdAt, counted: !row.invalidatedAt, disputeStatus: row.disputeStatus,
      // A seller can ask the system to check a cancellation or an unanswered question at any time, once.
      canCorrect: standing.isSeller && !row.invalidatedAt && !row.correctionId && (row.kind === "seller_cancellation" || row.kind === "inquiry_non_response"),
      canDispute: !row.invalidatedAt && (row.weight ?? 0) > 0 && !row.disputeStatus && Date.now() - row.createdAt.getTime() <= DISPUTE_WINDOW_DAYS * 86_400_000,
    })),
    seller: standing.isSeller ? {
      underWatch: standing.underWatch, needsReview: standing.needsReview, flags,
      fault: standing.fault && { ratePercent: Number(standing.fault.ratePercent.toFixed(1)), faults: standing.fault.faults, orders: standing.fault.orderCount, minOrders: sellerFaultPolicy.minOrders, gatePercent: sellerFaultPolicy.gatePercent, reviewPercent: sellerFaultPolicy.reviewPercent },
      rating: standing.rating && { bayesian: Number(standing.rating.rating.toFixed(2)), reviews: standing.rating.reviewCount, marketplaceAverage: Number(standing.rating.marketplaceAverage.toFixed(2)) },
      trustedSeller: standing.trusted, trustedRequirements: { minRating: trustedSellerPolicy.minRating, minCompletedOrders: trustedSellerPolicy.minCompletedOrders, completedOrders: standing.fault?.completedOrders ?? 0 },
      canBoost: standing.canBoost, canList: standing.canList,
    } : null,
  };
}

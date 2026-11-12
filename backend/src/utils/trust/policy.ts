import { trustJudgments } from "./ahp-judgments";
import { computeTrustPoints } from "./ahp-points";

export const trustPolicyVersion = "monitoring-v4" as const;

/** The old fixed points (Tables 1 and 2 of the Flagging and Trust Mechanism PDF). Used only when TRUST_WEIGHT_SOURCE=fixed, as a rollback. */
export const fixedTrustWeights = {
  inquiry_non_response: 1,
  seller_cancellation: 2,
  low_rating: 1,
  misleading_product_info: 2,
  inappropriate_communication: 2,
  seller_decline_fault: 2,
  qr_misuse: 3,
  buyer_failed_reservation: 2,
  buyer_late_cancellation: 1,
  buyer_invalid_decline: 1,
  buyer_false_photo: 2,
  buyer_fake_reports: 1,
  self_order: 3,
  chat_spam: 1,
  chat_personal_data: 1,
} as const;

export type TrustKind = keyof typeof fixedTrustWeights;

/** AHP result (Trust Points and AHP Guide): weights, consistency ratios and points from the judges' pair matrices. */
export const trustAhp = computeTrustPoints(trustJudgments);

/** Where the points come from: "ahp" (default) or "fixed" (the old own picks, for rollback). */
export const trustWeightSource = process.env.TRUST_WEIGHT_SOURCE === "fixed" ? "fixed" as const : "ahp" as const;

/** Points for each verified event. */
export const trustPolicyWeights: Record<TrustKind, number> = trustWeightSource === "fixed"
  ? { ...fixedTrustWeights }
  : Object.fromEntries((Object.keys(fixedTrustWeights) as TrustKind[]).map((kind) => {
    const points = trustAhp.points[kind];
    if (points === undefined) throw new Error(`Trust AHP has no points for ${kind}`);
    return [kind, points];
  })) as Record<TrustKind, number>;

/** "1 point" or "5 points" for a violation kind, so every message shows the live number. */
export const pointsText = (kind: TrustKind) => `${trustPolicyWeights[kind]} point${trustPolicyWeights[kind] === 1 ? "" : "s"}`;

/** Serious violations skip the steps: QR misuse and orders from the seller's own account block at once. */
export const trustSeriousKinds: readonly string[] = ["qr_misuse", "self_order"];

/** Different people who must report the same thing before it counts as a confirmed violation. */
export const trustReportConfirmCount = Math.max(2, Number.isInteger(Number(process.env.TRUST_REPORT_CONFIRM_COUNT)) ? Number(process.env.TRUST_REPORT_CONFIRM_COUNT) : 2);

function configuredInteger(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

/** Violations older than this many days stop counting toward the score. 0 keeps them forever. */
export const trustScoreWindowDays = configuredInteger("TRUST_SCORE_WINDOW_DAYS", 90);

/** The oldest moment that still counts toward the score, or null when nothing expires. */
export function trustScoreWindowStart(now = new Date()): Date | null {
  return trustScoreWindowDays > 0 ? new Date(now.getTime() - trustScoreWindowDays * 86_400_000) : null;
}

/**
 * Thresholds are fractions of the total possible score (guide step 7). The fractions keep the old ladder's shape:
 * 2, 4, 6, 8 and 12 out of the old total of 25 points. An env value still overrides a threshold.
 */
export const trustThresholdFractions = { notice: 2 / 25, warning: 4 / 25, tier1: 6 / 25, tier2: 8 / 25, blocked: 12 / 25 } as const;
const totalPossible = Object.values(trustPolicyWeights).reduce((sum, value) => sum + value, 0);
const fromTotal = (fraction: number) => Math.max(1, Math.round(fraction * totalPossible));

const noticeThreshold = configuredInteger("TRUST_NOTICE_THRESHOLD", fromTotal(trustThresholdFractions.notice));
const warningThreshold = Math.max(noticeThreshold + 1, configuredInteger("TRUST_WARNING_THRESHOLD", fromTotal(trustThresholdFractions.warning)));
const tier1Threshold = Math.max(warningThreshold + 1, configuredInteger("TRUST_TIER1_THRESHOLD", fromTotal(trustThresholdFractions.tier1)));
const tier2Threshold = Math.max(tier1Threshold + 1, configuredInteger("TRUST_TIER2_THRESHOLD", fromTotal(trustThresholdFractions.tier2)));
const blockedThreshold = configuredInteger("TRUST_BLOCK_THRESHOLD", fromTotal(trustThresholdFractions.blocked));

/** Table 3 bands, now scaled to the AHP points. Both roles use the same numbers. */
export const trustActionPolicy = {
  enabled: process.env.TRUST_ACTIONS_ENABLED !== "false",
  totalPossible,
  noticeThreshold,
  warningThreshold,
  tier1Threshold,
  tier2Threshold,
  restrictionThreshold: tier1Threshold,
  /** Must sit above the 3-day pause, otherwise the blocking level would hide it. */
  blockedThreshold: blockedThreshold > tier2Threshold ? blockedThreshold : tier2Threshold + 4,
} as const;

/** Seller fault-rate gate (Equation 2). A Pause or Block for sellers needs both the score and this rate. */
export const sellerFaultPolicy = {
  minOrders: configuredInteger("SELLER_FAULT_MIN_ORDERS", 10),
  gatePercent: configuredInteger("SELLER_FAULT_GATE_PERCENT", 10),
  reviewPercent: configuredInteger("SELLER_FAULT_REVIEW_PERCENT", 15),
  /** Confirmed seller-fault pickup returns inside the score window that flag a seller for review. */
  repeatReturnFlag: configuredInteger("SELLER_REPEAT_RETURN_FLAG", 5),
} as const;

export const trustedSellerPolicy = {
  minRating: 4.5,
  minCompletedOrders: 20,
  phantomReviews: 5,
  /** Used when no review exists anywhere yet. */
  defaultMarketplaceRating: 4.0,
} as const;

export type TrustActionType = "notice" | "warning" | "temporary_restriction" | "blocked";

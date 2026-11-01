export const trustPolicyVersion = "monitoring-v3" as const;

export const trustPolicyWeights = {
  inquiry_non_response: 1,
  seller_cancellation: 2,
  low_rating: 1,
  buyer_failed_reservation: 2,
  // Confirmed reports (see confirm-report.ts). The paper lists these as violation types too.
  misleading_product_info: 2,
  inappropriate_communication: 2,
  qr_misuse: 3,
} as const;

/** Violation kinds the paper treats as serious: one confirmed case blocks the account (Table 18). */
export const trustSeriousKinds: readonly string[] = ["qr_misuse"];

/** Different people who must report the same thing before it counts as a confirmed violation. */
export const trustReportConfirmCount = Math.max(2, Number.isInteger(Number(process.env.TRUST_REPORT_CONFIRM_COUNT)) ? Number(process.env.TRUST_REPORT_CONFIRM_COUNT) : 2);

function configuredInteger(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

const tier3Threshold = configuredInteger("TRUST_TIER3_THRESHOLD", 10);
/** Must sit above the last restriction tier, otherwise the blocking level would hide the 72-hour tier. */
const configuredBlock = configuredInteger("TRUST_BLOCK_THRESHOLD", 12);
const blockedThreshold = configuredBlock > tier3Threshold ? configuredBlock : tier3Threshold + 2;

/** Violations older than this many days stop counting toward the score. 0 keeps them forever. */
export const trustScoreWindowDays = configuredInteger("TRUST_SCORE_WINDOW_DAYS", 90);

/** The oldest moment that still counts toward the score, or null when nothing expires. */
export function trustScoreWindowStart(now = new Date()): Date | null {
  return trustScoreWindowDays > 0 ? new Date(now.getTime() - trustScoreWindowDays * 86_400_000) : null;
}

export const trustActionPolicy = {
  enabled: process.env.TRUST_ACTIONS_ENABLED !== "false",
  warningThreshold: configuredInteger("TRUST_WARNING_THRESHOLD", 4),
  tier1Threshold: configuredInteger("TRUST_TIER1_THRESHOLD", 6),
  tier2Threshold: configuredInteger("TRUST_TIER2_THRESHOLD", 8),
  tier3Threshold,
  restrictionThreshold: configuredInteger("TRUST_RESTRICTION_THRESHOLD", 6),
  blockedThreshold,
} as const;

export type TrustActionType = "warning" | "temporary_restriction" | "blocked";

export function resolveTrustDurationHours(weightedPoints: number): number {
  if (weightedPoints >= trustActionPolicy.tier3Threshold) return 72; // 3 days
  if (weightedPoints >= trustActionPolicy.tier2Threshold) return 24; // 24 hours
  if (weightedPoints >= trustActionPolicy.tier1Threshold) return 12; // 12 hours
  return 0; // 4 points is warning only (no restriction)
}

export function resolveTrustAction(weightedPoints: number, hasSeriousViolation = false): TrustActionType | null {
  if (hasSeriousViolation || weightedPoints >= trustActionPolicy.blockedThreshold) return "blocked";
  if (weightedPoints >= trustActionPolicy.tier1Threshold) return "temporary_restriction";
  if (weightedPoints >= trustActionPolicy.warningThreshold) return "warning";
  return null;
}

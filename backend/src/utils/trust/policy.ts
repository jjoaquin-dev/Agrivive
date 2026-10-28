export const trustPolicyVersion = "monitoring-v3" as const;

export const trustPolicyWeights = {
  inquiry_non_response: 1,
  seller_cancellation: 2,
  low_rating: 1,
  buyer_failed_reservation: 2,
} as const;

function configuredInteger(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

export const trustActionPolicy = {
  enabled: process.env.TRUST_ACTIONS_ENABLED !== "false",
  warningThreshold: configuredInteger("TRUST_WARNING_THRESHOLD", 4),
  tier1Threshold: configuredInteger("TRUST_TIER1_THRESHOLD", 6),
  tier2Threshold: configuredInteger("TRUST_TIER2_THRESHOLD", 8),
  tier3Threshold: configuredInteger("TRUST_TIER3_THRESHOLD", 10),
  restrictionThreshold: configuredInteger("TRUST_RESTRICTION_THRESHOLD", 6),
  blockedThreshold: configuredInteger("TRUST_BLOCK_THRESHOLD", 10),
} as const;

export type TrustActionType = "warning" | "temporary_restriction" | "blocked";

export function resolveTrustDurationHours(weightedPoints: number): number {
  if (weightedPoints >= trustActionPolicy.tier3Threshold) return 72; // 3 days
  if (weightedPoints >= trustActionPolicy.tier2Threshold) return 24; // 24 hours
  if (weightedPoints >= trustActionPolicy.tier1Threshold) return 12; // 12 hours
  return 0; // 4 points is warning only (no restriction)
}

export function resolveTrustAction(weightedPoints: number): TrustActionType | null {
  if (weightedPoints >= trustActionPolicy.tier1Threshold) return "temporary_restriction";
  if (weightedPoints >= trustActionPolicy.warningThreshold) return "warning";
  return null;
}

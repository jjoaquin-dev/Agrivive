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
  warningThreshold: configuredInteger("TRUST_WARNING_THRESHOLD", 3),
  restrictionThreshold: configuredInteger("TRUST_RESTRICTION_THRESHOLD", 5),
  blockedThreshold: configuredInteger("TRUST_BLOCK_THRESHOLD", 8),
  restrictionHours: configuredInteger("TRUST_RESTRICTION_HOURS", 168),
} as const;

export type TrustActionType = "warning" | "temporary_restriction" | "blocked";

export function resolveTrustAction(weightedPoints: number): TrustActionType | null {
  if (weightedPoints >= trustActionPolicy.blockedThreshold) return "blocked";
  if (weightedPoints >= trustActionPolicy.restrictionThreshold) return "temporary_restriction";
  if (weightedPoints >= trustActionPolicy.warningThreshold) return "warning";
  return null;
}

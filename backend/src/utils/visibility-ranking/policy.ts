import { ahpTopsisPolicyVersion } from "../ahp-topsis";

export const baselinePolicyVersion = "visibility-v4" as const;

export type MarketplaceVisibilityPolicy = typeof baselinePolicyVersion | typeof ahpTopsisPolicyVersion;

// AHP-TOPSIS is the default. Only the exact baseline value (any case, spaces ignored) rolls back to the old formula.
export function resolveVisibilityPolicy(setting: string | undefined): MarketplaceVisibilityPolicy {
  return setting?.trim().toLowerCase() === baselinePolicyVersion ? baselinePolicyVersion : ahpTopsisPolicyVersion;
}

export function scoreTier(score: number | null, policyVersion: MarketplaceVisibilityPolicy) {
  if (score === null) return null;
  const priorityThreshold = policyVersion === ahpTopsisPolicyVersion ? .60 : .70;
  return score >= priorityThreshold ? "priority" : score >= .40 ? "standard" : "basic";
}

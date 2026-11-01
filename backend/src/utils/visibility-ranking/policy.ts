import { ahpTopsisPolicyVersion } from "../ahp-topsis";

export const baselinePolicyVersion = "visibility-v4" as const;

export type MarketplaceVisibilityPolicy = typeof baselinePolicyVersion | typeof ahpTopsisPolicyVersion;

// Anything other than the exact AHP-TOPSIS value (including unset) means the baseline formula.
export function resolveVisibilityPolicy(setting: string | undefined): MarketplaceVisibilityPolicy {
  return setting?.trim().toLowerCase() === ahpTopsisPolicyVersion ? ahpTopsisPolicyVersion : baselinePolicyVersion;
}

export function scoreTier(score: number | null, policyVersion: MarketplaceVisibilityPolicy) {
  if (score === null) return null;
  const priorityThreshold = policyVersion === ahpTopsisPolicyVersion ? .60 : .70;
  return score >= priorityThreshold ? "priority" : score >= .40 ? "standard" : "basic";
}

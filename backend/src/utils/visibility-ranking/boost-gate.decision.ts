import type { VisibilityTier } from "./index";

// The paper lets only Priority Boost listings (AHP-TOPSIS score 0.60 or higher) qualify for the promotion boost.
export function decideBoostGate(result: { tier: VisibilityTier; score: number } | undefined) {
  if (result?.tier === "Priority Boost") return { allowed: true as const, tier: result.tier, score: result.score };
  if (!result) {
    return {
      allowed: false as const, tier: null, score: null,
      headline: "Not Ranked Yet",
      message: "Boost opens when your listing is on sale and reaches Priority Boost.",
    };
  }
  return {
    allowed: false as const, tier: result.tier, score: result.score,
    headline: "Priority Boost Needed",
    message: `Boost opens at Priority Boost. This listing is ${result.tier} right now.`,
  };
}

import {
  ahpTopsisPolicyVersion,
  rankWithAHPAndTOPSIS,
  type VisibilityCriteria,
} from "../ahp-topsis";

export const priorityVisibilityThreshold = 0.60;

export type VisibilityRankingCandidate = {
  id: string;
  publishedAt: Date;
  criteria: VisibilityCriteria;
};

export type VisibilityTier = "Priority Boost" | "Standard Exposure" | "Basic/Hold";

export function getVisibilityTier(score: number): VisibilityTier {
  if (score >= priorityVisibilityThreshold) return "Priority Boost";
  if (score >= 0.40) return "Standard Exposure";
  return "Basic/Hold";
}

export function rankVisibilityCandidates(candidates: VisibilityRankingCandidate[]) {
  const ranking = rankWithAHPAndTOPSIS(candidates.map(({ id, criteria }) => ({ id, criteria })));
  const candidatesById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const results = ranking.results.map((result) => ({
    ...result,
    publishedAt: candidatesById.get(result.id)?.publishedAt ?? new Date(0),
    tier: getVisibilityTier(result.score),
  })).sort((left, right) => {
    const scoreDifference = right.score - left.score;
    if (scoreDifference !== 0) return scoreDifference;
    const publishedDifference = right.publishedAt.getTime() - left.publishedAt.getTime();
    return publishedDifference || right.id.localeCompare(left.id);
  }).map((result, index) => ({ ...result, rank: index + 1 }));

  return {
    policyVersion: ahpTopsisPolicyVersion,
    weights: ranking.weights,
    consistencyRatio: ranking.consistencyRatio,
    results,
  };
}

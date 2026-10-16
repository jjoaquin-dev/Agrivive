import { createVisibilityCriteria } from "../../../utils/ahp-topsis";
import { rankVisibilityCandidates } from "../../../utils/visibility-ranking";

export type MarketplaceVisibilityCursor = {
  score: number | null;
  publishedAt: Date;
  id: string;
};

type MarketplaceVisibilityRow = {
  id: string;
  imagUrl: string | null;
  sellerId: string;
  distanceKm: number | null;
  visibilityScore: number | null;
  productQty: unknown;
  originalQty: unknown;
  publishedAt: Date | null;
  ahpPriorCycles: number | null;
  sellerReliability: number | null;
};

export function rankMarketplaceProductsWithAHP(
  rows: MarketplaceVisibilityRow[],
  evaluatedAt: Date,
  cursor: MarketplaceVisibilityCursor | null,
) {
  const alternatives = rows.flatMap((row) => {
    const originalQuantity = Number(row.originalQty);
    const publishedAt = row.publishedAt;
    if (!publishedAt || publishedAt > evaluatedAt || !Number.isFinite(originalQuantity) || originalQuantity <= 0) return [];
    return [{
      id: row.id,
      criteria: createVisibilityCriteria({
        ageHours: (evaluatedAt.getTime() - publishedAt.getTime()) / (60 * 60 * 1000),
        stockRatio: Number(row.productQty) / originalQuantity,
        sellerReliability: Number(row.sellerReliability ?? 0.5),
        priorCycles: Number(row.ahpPriorCycles ?? 0),
      }),
    }];
  });
  const ranking = rankVisibilityCandidates(alternatives.map((alternative) => ({
    ...alternative,
    publishedAt: rows.find((row) => row.id === alternative.id)?.publishedAt ?? evaluatedAt,
  })));
  const scores = new Map(ranking.results.map((result) => [result.id, result.score]));
  const orderedRows = [...rows].sort((left, right) => {
    const leftScore = scores.get(left.id) ?? null;
    const rightScore = scores.get(right.id) ?? null;
    if (leftScore === null && rightScore !== null) return 1;
    if (leftScore !== null && rightScore === null) return -1;
    if (leftScore !== null && rightScore !== null && leftScore !== rightScore) return rightScore - leftScore;
    const publishedDifference = (right.publishedAt?.getTime() ?? 0) - (left.publishedAt?.getTime() ?? 0);
    return publishedDifference || right.id.localeCompare(left.id);
  }).filter((row) => {
    if (!cursor) return true;
    const rowScore = scores.get(row.id) ?? null;
    if (cursor.score === null) {
      return rowScore === null && row.publishedAt !== null && row.publishedAt < cursor.publishedAt;
    }
    if (rowScore === null || rowScore < cursor.score) return true;
    return rowScore === cursor.score && row.publishedAt !== null &&
      (row.publishedAt < cursor.publishedAt ||
        (row.publishedAt.getTime() === cursor.publishedAt.getTime() && row.id < cursor.id));
  });

  return { orderedRows, scores };
}

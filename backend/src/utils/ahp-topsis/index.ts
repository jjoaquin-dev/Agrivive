const criterionCount = 4;
const consistencyRandomIndex = 0.9;

export const ahpTopsisPolicyVersion = "visibility-ahptopsis-v1" as const;

export const ahpPairwiseMatrix = [
  [1, 1.333333, 2, 4],
  [0.75, 1, 1.5, 3],
  [0.5, 0.666667, 1, 2],
  [0.25, 0.333333, 0.5, 1],
] as const;

export type VisibilityCriteria = {
  freshness: number;
  stockAvailability: number;
  sellerReliability: number;
  recurrence: number;
};

export type AHPAlternative = {
  id: string;
  criteria: VisibilityCriteria;
};

export type AHPWeights = {
  freshness: number;
  stockAvailability: number;
  sellerReliability: number;
  recurrence: number;
};

export type AHPResult = {
  id: string;
  score: number;
  rank: number;
  criteria: VisibilityCriteria;
  weightedCriteria: VisibilityCriteria;
  distanceToIdeal: number;
  distanceToWorst: number;
};

export type AHPRanking = {
  weights: AHPWeights;
  consistencyRatio: number;
  results: AHPResult[];
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function criterionValues(criteria: VisibilityCriteria): number[] {
  return [criteria.freshness, criteria.stockAvailability, criteria.sellerReliability, criteria.recurrence];
}

function valuesToCriteria(values: number[]): VisibilityCriteria {
  return {
    freshness: values[0] ?? 0,
    stockAvailability: values[1] ?? 0,
    sellerReliability: values[2] ?? 0,
    recurrence: values[3] ?? 0,
  };
}

export function createVisibilityCriteria(input: {
  ageHours: number;
  stockRatio: number;
  sellerReliability: number;
  priorCycles: number;
}): VisibilityCriteria {
  return {
    freshness: clamp(1 - Math.max(0, input.ageHours) / 12),
    stockAvailability: clamp(input.stockRatio),
    sellerReliability: clamp(input.sellerReliability),
    recurrence: clamp(input.priorCycles / 3),
  };
}

export function calculateAHPWeights(matrix: readonly (readonly number[])[] = ahpPairwiseMatrix) {
  if (matrix.length !== criterionCount || matrix.some((row) => row.length !== criterionCount)) {
    throw new Error("AHP pairwise matrix must be 4 by 4");
  }
  const geometricMeans = matrix.map((row) => Math.pow(row.reduce((product, value) => product * value, 1), 1 / criterionCount));
  const total = geometricMeans.reduce((sum, value) => sum + value, 0);
  const weights = geometricMeans.map((value) => value / total);
  const lambdaRatios = matrix.map((row, rowIndex) =>
    row.reduce((sum, value, columnIndex) => sum + value * weights[columnIndex], 0) / weights[rowIndex]);
  const lambdaMax = lambdaRatios.reduce((sum, value) => sum + value, 0) / criterionCount;
  const consistencyIndex = (lambdaMax - criterionCount) / (criterionCount - 1);
  const consistencyRatio = Math.max(0, consistencyIndex / consistencyRandomIndex);

  return {
    weights: valuesToCriteria(weights),
    consistencyRatio,
  };
}

export function rankWithAHPAndTOPSIS(
  alternatives: AHPAlternative[],
  matrix: readonly (readonly number[])[] = ahpPairwiseMatrix,
): AHPRanking {
  const { weights, consistencyRatio } = calculateAHPWeights(matrix);
  if (alternatives.length === 0) return { weights, consistencyRatio, results: [] };

  const rawColumns = Array.from({ length: criterionCount }, (_, criterionIndex) =>
    alternatives.map((alternative) => criterionValues(alternative.criteria)[criterionIndex] ?? 0));
  const normalizedColumns = rawColumns.map((column) => {
    const length = Math.sqrt(column.reduce((sum, value) => sum + value ** 2, 0));
    return length === 0 ? column.map(() => 0) : column.map((value) => value / length);
  });
  const weightValues = criterionValues(weights);
  const weightedRows = alternatives.map((_, alternativeIndex) =>
    normalizedColumns.map((column, criterionIndex) => column[alternativeIndex] * weightValues[criterionIndex]));
  const idealBest = Array.from({ length: criterionCount }, (_, criterionIndex) =>
    Math.max(...weightedRows.map((row) => row[criterionIndex] ?? 0)));
  const idealWorst = Array.from({ length: criterionCount }, (_, criterionIndex) =>
    Math.min(...weightedRows.map((row) => row[criterionIndex] ?? 0)));

  const results = alternatives.map((alternative, alternativeIndex) => {
    const weighted = weightedRows[alternativeIndex] ?? [];
    const distanceToIdeal = Math.sqrt(weighted.reduce((sum, value, index) => sum + (value - (idealBest[index] ?? 0)) ** 2, 0));
    const distanceToWorst = Math.sqrt(weighted.reduce((sum, value, index) => sum + (value - (idealWorst[index] ?? 0)) ** 2, 0));
    const denominator = distanceToIdeal + distanceToWorst;
    return {
      id: alternative.id,
      score: denominator === 0 ? 0.5 : distanceToWorst / denominator,
      rank: 0,
      criteria: alternative.criteria,
      weightedCriteria: valuesToCriteria(weighted),
      distanceToIdeal,
      distanceToWorst,
    };
  }).sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));

  return {
    weights,
    consistencyRatio,
    results: results.map((result, index) => ({ ...result, rank: index + 1 })),
  };
}

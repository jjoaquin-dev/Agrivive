import { all, create } from "mathjs";

const math = create(all);

// mathjs types its results loosely; these just say what shape they really have.
const vec = (value: unknown) => value as number[];
const mat = (value: unknown) => value as number[][];

export const ahpTopsisPolicyVersion = "visibility-ahptopsis-v1" as const;

/*
 * Criteria, in matrix order (all raw values; AHP-TOPSIS does the scaling itself):
 * 1. Posting age     hours since the listing was published
 * 2. Price drop      base price minus current price, per unit
 * 3. Stock level     quantity left
 * 4. Seller reliability  average rating, out of 5
 */
export const criterionKeys = ["postingAge", "priceDrop", "stockLevel", "sellerReliability"] as const;

// Saaty scale judgments, same matrix as ahp-test.ts.
export const ahpPairwiseMatrix: number[][] = [
  [1, 1, 2, 3],
  [1, 1, 2, 3],
  [1 / 2, 1 / 2, 1, 2],
  [1 / 3, 1 / 3, 1 / 2, 1],
];

// Saaty random index for 4 criteria.
const consistencyRandomIndex = 0.9;
export const maxConsistencyRatio = 0.1;

export type VisibilityCriteria = {
  postingAge: number;
  priceDrop: number;
  stockLevel: number;
  sellerReliability: number;
};

export type AHPAlternative = { id: string; criteria: VisibilityCriteria };
export type AHPWeights = VisibilityCriteria;

export type AHPResult = {
  id: string;
  score: number;
  rank: number;
  criteria: VisibilityCriteria;
  normalizedCriteria: VisibilityCriteria;
  weightedCriteria: VisibilityCriteria;
  distanceToIdeal: number;
  distanceToWorst: number;
};

export type AHPRanking = {
  weights: AHPWeights;
  consistencyRatio: number;
  results: AHPResult[];
};

const toValues = (criteria: VisibilityCriteria) => criterionKeys.map((key) => criteria[key]);
const toCriteria = (values: number[]) => Object.fromEntries(
  criterionKeys.map((key, index) => [key, values[index] ?? 0]),
) as VisibilityCriteria;

/** Clean raw inputs: unusable numbers become 0, nothing else is rescaled. */
export function createVisibilityCriteria(input: {
  ageHours: number;
  basePrice?: number | null;
  price?: number | null;
  stock: number;
  sellerRating: number;
}): VisibilityCriteria {
  const safe = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);
  const drop = input.basePrice != null && input.price != null ? input.basePrice - input.price : 0;
  return {
    postingAge: safe(input.ageHours),
    priceDrop: safe(drop),
    stockLevel: safe(input.stock),
    sellerReliability: safe(input.sellerRating),
  };
}

/** AHP: column sums, normalise, row means are the weights; then the consistency check. */
export function calculateAHPWeights(matrix: number[][] = ahpPairwiseMatrix) {
  const size = criterionKeys.length;
  if (matrix.length !== size || matrix.some((row) => row.length !== size)) {
    throw new Error("AHP pairwise matrix must be 4 by 4");
  }
  const columnSums = vec(math.sum(matrix, 0));
  const normalized = math.dotDivide(matrix, columnSums);
  const weights = vec(math.mean(normalized, 1));

  const weightedSum = vec(math.multiply(matrix, weights));
  const lambdaMax = math.mean(vec(math.dotDivide(weightedSum, weights)));
  const consistencyIndex = (lambdaMax - size) / (size - 1);
  const consistencyRatio = Math.max(0, consistencyIndex / consistencyRandomIndex);

  return { weights: toCriteria(weights), consistencyRatio, lambdaMax, consistencyIndex };
}

/** TOPSIS on raw criteria, weighted by AHP. Every criterion counts as "bigger is better". */
export function rankWithAHPAndTOPSIS(alternatives: AHPAlternative[], matrix: number[][] = ahpPairwiseMatrix): AHPRanking {
  const { weights, consistencyRatio } = calculateAHPWeights(matrix);
  if (consistencyRatio > maxConsistencyRatio) {
    throw new Error(`AHP judgments are not consistent (CR ${consistencyRatio.toFixed(4)}); redo them`);
  }
  if (alternatives.length === 0) return { weights, consistencyRatio, results: [] };

  const decision = alternatives.map((alternative) => toValues(alternative.criteria));
  // Vector normalisation: value / sqrt(sum of squares of its column). An all-zero column stays 0.
  const denominators = vec(math.sum(math.dotPow(decision, 2), 0)).map((sum) => {
    const root = Math.sqrt(sum);
    return root === 0 ? 1 : root;
  });
  const normalized = mat(math.dotDivide(decision, denominators));
  const weighted = mat(math.dotMultiply(normalized, toValues(weights)));

  const idealBest = vec(math.max(weighted, 0));
  const idealWorst = vec(math.min(weighted, 0));
  const distance = (row: number[], ideal: number[]) =>
    Math.sqrt(Number(math.sum(math.dotPow(math.subtract(row, ideal), 2))));

  const results = alternatives.map((alternative, index) => {
    const distanceToIdeal = distance(weighted[index]!, idealBest);
    const distanceToWorst = distance(weighted[index]!, idealWorst);
    const total = distanceToIdeal + distanceToWorst;
    return {
      id: alternative.id,
      score: total === 0 ? 0.5 : distanceToWorst / total,
      rank: 0,
      criteria: alternative.criteria,
      normalizedCriteria: toCriteria(normalized[index]!),
      weightedCriteria: toCriteria(weighted[index]!),
      distanceToIdeal,
      distanceToWorst,
    };
  }).sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));

  return { weights, consistencyRatio, results: results.map((result, index) => ({ ...result, rank: index + 1 })) };
}

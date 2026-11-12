/**
 * Trust points from AHP (Saaty, 1980), following the Trust Points and AHP Guide:
 * judges compare two violations at a time, the math turns the pairs into weights,
 * the consistency ratio checks the judges did not contradict themselves, and weights become points.
 */

/** Saaty's random index for a matrix of size n. Sizes 1 and 2 are always consistent. */
export const randomIndex: Record<number, number> = { 1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49 };
export const maxTrustConsistencyRatio = 0.1;

export type PairMatrix = number[][];

/** Many judges: each merged cell is the geometric mean of that cell across judges. */
export function mergeJudges(matrices: PairMatrix[]): PairMatrix {
  if (!matrices.length) throw new Error("AHP needs at least one judge matrix");
  const n = matrices[0]!.length;
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) =>
    Math.pow(matrices.reduce((product, matrix) => product * matrix[i]![j]!, 1), 1 / matrices.length)));
}

/** Divide each cell by its column sum, average each row (the weight), then lambda max, CI and CR. */
export function ahpWeights(matrix: PairMatrix) {
  const n = matrix.length;
  if (!n || matrix.some((row) => row.length !== n)) throw new Error("AHP matrix must be square");
  if (!(n in randomIndex)) throw new Error(`AHP matrix of size ${n} has no random index`);
  const columnSums = Array.from({ length: n }, (_, j) => matrix.reduce((sum, row) => sum + row[j]!, 0));
  const weights = matrix.map((row) => row.reduce((sum, cell, j) => sum + cell / columnSums[j]!, 0) / n);
  const lambdaMax = matrix.reduce((sum, row, i) => sum + row.reduce((s, cell, j) => s + cell * weights[j]!, 0) / weights[i]!, 0) / n;
  const consistencyIndex = n > 2 ? (lambdaMax - n) / (n - 1) : 0;
  const consistencyRatio = randomIndex[n] ? Math.max(0, consistencyIndex / randomIndex[n]!) : 0;
  return { columnSums, weights, lambdaMax, consistencyIndex, consistencyRatio };
}

/** Builds a full reciprocal matrix from the upper-triangle answers: [rowItem, columnItem, Saaty value]. */
export function pairMatrix(items: readonly string[], answers: readonly (readonly [string, string, number])[]): PairMatrix {
  const matrix = items.map(() => items.map(() => 1));
  for (const [a, b, value] of answers) {
    const i = items.indexOf(a);
    const j = items.indexOf(b);
    if (i < 0 || j < 0 || i === j) throw new Error(`AHP answer ${a} vs ${b} does not match the group`);
    matrix[i]![j] = value;
    matrix[j]![i] = 1 / value;
  }
  return matrix;
}

export type TrustGroupJudgments = { items: readonly string[]; judges: PairMatrix[] };
export type TrustJudgments = {
  /** "sample" until real judges fill the matrices. */
  source: "sample" | "judges";
  groupOrder: readonly string[];
  groupJudges: PairMatrix[];
  groups: Record<string, TrustGroupJudgments>;
};

/**
 * Runs AHP inside each group and on the groups, then: final weight = group weight x weight inside the group,
 * points = round(final weight / smallest final weight), at least 1. Throws when any CR is over 0.10, so judges redo the pairs.
 */
export function computeTrustPoints(judgments: TrustJudgments) {
  const check = (name: string, cr: number) => {
    if (cr > maxTrustConsistencyRatio) throw new Error(`Trust AHP for ${name} is not consistent (CR ${cr.toFixed(4)}); judges must redo the pairs`);
  };
  const top = ahpWeights(mergeJudges(judgments.groupJudges));
  check("groups", top.consistencyRatio);
  const finals: Record<string, number> = {};
  const groups = judgments.groupOrder.map((name, index) => {
    const group = judgments.groups[name];
    if (!group) throw new Error(`Trust AHP group ${name} has no judgments`);
    const inner = ahpWeights(mergeJudges(group.judges));
    check(name, inner.consistencyRatio);
    group.items.forEach((item, i) => { finals[item] = top.weights[index]! * inner.weights[i]!; });
    return { name, weight: top.weights[index]!, consistencyRatio: inner.consistencyRatio, items: group.items, weights: inner.weights };
  });
  const smallest = Math.min(...Object.values(finals));
  const points = Object.fromEntries(Object.entries(finals).map(([kind, weight]) => [kind, Math.max(1, Math.round(weight / smallest))]));
  const total = Object.values(points).reduce((sum, value) => sum + value, 0);
  return { source: judgments.source, groupConsistencyRatio: top.consistencyRatio, groups, finals, points, total };
}

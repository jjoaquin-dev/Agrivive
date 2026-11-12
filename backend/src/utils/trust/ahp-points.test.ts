import { describe, expect, test } from "bun:test";
import { ahpWeights, computeTrustPoints, mergeJudges, pairMatrix } from "./ahp-points";
import { trustJudgments } from "./ahp-judgments";

const round = (values: number[], digits = 3) => values.map((v) => Number(v.toFixed(digits)));

describe("AHP math matches the Trust Points and AHP Guide samples", () => {
  test("Sample 1 seller violations: weights, CR 0.044", () => {
    const r = ahpWeights([[1, 3, 5, 7], [1 / 3, 1, 3, 5], [1 / 5, 1 / 3, 1, 3], [1 / 7, 1 / 5, 1 / 3, 1]]);
    expect(round(r.columnSums)).toEqual([1.676, 4.533, 9.333, 16]);
    expect(round(r.weights)).toEqual([0.558, 0.263, 0.122, 0.057]);
    expect(Number(r.lambdaMax.toFixed(3))).toBe(4.118);
    expect(Number(r.consistencyRatio.toFixed(3))).toBe(0.044);
  });
  test("Sample 2 buyer violations: weights, CR 0.005", () => {
    const r = ahpWeights([[1, 2, 3, 5], [1 / 2, 1, 2, 3], [1 / 3, 1 / 2, 1, 2], [1 / 5, 1 / 3, 1 / 2, 1]]);
    expect(round(r.weights)).toEqual([0.482, 0.272, 0.158, 0.088]);
    expect(Number(r.consistencyRatio.toFixed(3))).toBe(0.005);
  });
  test("Sample 3 chat: CR 0.033 with RI 0.58", () => {
    const r = ahpWeights([[1, 3, 5], [1 / 3, 1, 3], [1 / 5, 1 / 3, 1]]);
    expect(round(r.weights)).toEqual([0.633, 0.26, 0.106]);
    expect(Number(r.consistencyRatio.toFixed(3))).toBe(0.033);
  });
  test("Sample 4 groups: weights, CR 0.011", () => {
    const r = ahpWeights([[1, 2, 4, 3], [1 / 2, 1, 3, 2], [1 / 4, 1 / 3, 1, 1 / 2], [1 / 3, 1 / 2, 2, 1]]);
    expect(round(r.weights)).toEqual([0.466, 0.277, 0.096, 0.161]);
    expect(Number(r.consistencyRatio.toFixed(3))).toBe(0.011);
  });
  test("Sample 5 two judges merged by geometric mean: 3.873 and 7.937, CR 0.014", () => {
    const merged = mergeJudges([[[1, 3, 7], [1 / 3, 1, 3], [1 / 7, 1 / 3, 1]], [[1, 5, 9], [1 / 5, 1, 3], [1 / 9, 1 / 3, 1]]]);
    expect(Number(merged[0]![1]!.toFixed(3))).toBe(3.873);
    expect(Number(merged[0]![2]!.toFixed(3))).toBe(7.937);
    const r = ahpWeights(merged);
    expect(round(r.weights)).toEqual([0.71, 0.21, 0.08]);
    expect(Number(r.consistencyRatio.toFixed(3))).toBe(0.014);
  });
});

describe("trust points from the judgments", () => {
  const result = computeTrustPoints(trustJudgments);
  test("every group passes the consistency check (CR 0.10 or less)", () => {
    expect(result.groupConsistencyRatio).toBeLessThanOrEqual(0.1);
    for (const group of result.groups) expect(group.consistencyRatio).toBeLessThanOrEqual(0.1);
  });
  test("all 15 violations get points, the smallest weight gets 1, every one at least 1", () => {
    expect(Object.keys(result.points)).toHaveLength(15);
    expect(Math.min(...Object.values(result.points))).toBe(1);
  });
  test("group weights add up to 1", () => {
    expect(result.groups.reduce((sum, g) => sum + g.weight, 0)).toBeCloseTo(1, 10);
  });
  test("inconsistent judges are refused", () => {
    const bad = pairMatrix(["a", "b", "c"], [["a", "b", 9], ["b", "c", 9], ["a", "c", 1 / 9]]);
    expect(() => computeTrustPoints({ ...trustJudgments, groupJudges: [bad], groupOrder: ["a", "b", "c"] })).toThrow(/not consistent/);
  });
  test("the judgments are still sample data until real judges fill them", () => expect(result.source).toBe("sample"));
});

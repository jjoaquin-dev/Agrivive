import { describe, expect, test } from "bun:test";
import { ahpPairwiseMatrix, calculateAHPWeights, createVisibilityCriteria, rankWithAHPAndTOPSIS } from "./index";
import { rankVisibilityCandidates } from "../visibility-ranking";

const now = new Date("2026-11-01T12:00:00Z");
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 3_600_000);

type Listing = { id: string; ageHours: number; basePrice: number; price: number; stock: number; sellerRating: number };
const candidate = (listing: Listing) => ({ id: listing.id, publishedAt: hoursAgo(listing.ageHours), criteria: createVisibilityCriteria(listing) });

// Plain-JS version of ahp-test.ts and topsis-test.ts, written without mathjs, to cross-check the engine.
function reference(rows: number[][]) {
  const n = 4;
  const colSums = ahpPairwiseMatrix[0]!.map((_, c) => ahpPairwiseMatrix.reduce((s, r) => s + r[c]!, 0));
  const weights = ahpPairwiseMatrix.map((r) => r.reduce((s, v, c) => s + v / colSums[c]!, 0) / n);
  const norms = Array.from({ length: n }, (_, c) => Math.sqrt(rows.reduce((s, r) => s + r[c]! ** 2, 0)) || 1);
  const v = rows.map((r) => r.map((x, c) => (x / norms[c]!) * weights[c]!));
  const best = Array.from({ length: n }, (_, c) => Math.max(...v.map((r) => r[c]!)));
  const worst = Array.from({ length: n }, (_, c) => Math.min(...v.map((r) => r[c]!)));
  const d = (r: number[], t: number[]) => Math.sqrt(r.reduce((s, x, c) => s + (x - t[c]!) ** 2, 0));
  return v.map((r) => d(r, worst) / (d(r, best) + d(r, worst)));
}

const veg: Listing[] = [
  { id: "kalabasa", ageHours: 5, basePrice: 50, price: 45, stock: 20, sellerRating: 4.5 },
  { id: "karot", ageHours: 2, basePrice: 60, price: 60, stock: 50, sellerRating: 4.5 },
  { id: "sigarilyas", ageHours: 9, basePrice: 80, price: 60, stock: 5, sellerRating: 4.5 },
];

describe("AHP weights", () => {
  test("Same weights as ahp-test.ts and the judgments are consistent (CR 0.10 or less)", () => {
    const { weights, consistencyRatio } = calculateAHPWeights();
    expect(weights.postingAge).toBeCloseTo(0.3507, 4);
    expect(weights.priceDrop).toBeCloseTo(0.3507, 4);
    expect(weights.stockLevel).toBeCloseTo(0.1892, 4);
    expect(weights.sellerReliability).toBeCloseTo(0.1093, 4);
    expect(Object.values(weights).reduce((s, w) => s + w, 0)).toBeCloseTo(1, 10);
    expect(consistencyRatio).toBeLessThanOrEqual(0.1);
  });

  test("Inconsistent judgments are refused", () => {
    const bad = [[1, 9, 1 / 9, 1], [1 / 9, 1, 9, 1], [9, 1 / 9, 1, 1], [1, 1, 1, 1]];
    expect(calculateAHPWeights(bad).consistencyRatio).toBeGreaterThan(0.1);
    expect(() => rankWithAHPAndTOPSIS([{ id: "a", criteria: createVisibilityCriteria(veg[0]!) }], bad)).toThrow();
  });
});

describe("TOPSIS on raw criteria", () => {
  test("Scores match the plain-JS reference of topsis-test.ts", () => {
    const { results } = rankWithAHPAndTOPSIS(veg.map((v) => ({ id: v.id, criteria: createVisibilityCriteria(v) })));
    const expected = reference(veg.map((v) => Object.values(createVisibilityCriteria(v))));
    veg.forEach((v, i) => expect(results.find((r) => r.id === v.id)!.score).toBeCloseTo(expected[i]!, 10));
  });

  test("Raw values go in unscaled; the engine's own normalised values are 0 to 1", () => {
    const [top] = rankWithAHPAndTOPSIS(veg.map((v) => ({ id: v.id, criteria: createVisibilityCriteria(v) }))).results;
    expect(top!.criteria.postingAge).toBe(9);
    expect(top!.criteria.priceDrop).toBe(20);
    expect(top!.criteria.stockLevel).toBe(5);
    for (const value of Object.values(top!.normalizedCriteria)) expect(value).toBeLessThanOrEqual(1);
  });

  test("Sigarilyas (oldest, biggest price drop) ranks first; ranks are 1..n and scores are descending", () => {
    const { results } = rankVisibilityCandidates(veg.map(candidate));
    expect(results.map((r) => r.id)).toEqual(["sigarilyas", "kalabasa", "karot"]);
    expect(results.map((r) => r.rank)).toEqual([1, 2, 3]);
    expect(results[0]!.score).toBeGreaterThan(results[1]!.score);
  });

  test("A column that is all zero (no price drops anywhere) does not break the scores", () => {
    const flat = veg.map((v) => ({ ...v, price: v.basePrice }));
    const { results } = rankWithAHPAndTOPSIS(flat.map((v) => ({ id: v.id, criteria: createVisibilityCriteria(v) })));
    for (const r of results) expect(Number.isFinite(r.score)).toBe(true);
  });

  test("Missing base price counts as no price drop; bad numbers become 0", () => {
    expect(createVisibilityCriteria({ ageHours: 1, basePrice: null, price: 10, stock: 3, sellerRating: 4 }).priceDrop).toBe(0);
    expect(createVisibilityCriteria({ ageHours: NaN, basePrice: 5, price: 10, stock: -2, sellerRating: 4 })).toEqual(
      { postingAge: 0, priceDrop: 0, stockLevel: 0, sellerReliability: 4 });
  });

  test("Same inputs rank the same on every refresh, newer first on a tie", () => {
    const base = { ageHours: 1, basePrice: 10, price: 8, stock: 5, sellerRating: 4 };
    const okra = candidate({ id: "okra", ...base });
    const carrots = { ...candidate({ id: "carrots", ...base }), publishedAt: new Date(okra.publishedAt.getTime() - 5 * 60_000) };
    for (const input of [[okra, carrots], [carrots, okra]]) {
      expect(rankVisibilityCandidates(input).results.map((r) => r.id)).toEqual(["okra", "carrots"]);
    }
  });
});

describe("Edge cases", () => {
  test("A lone listing scores exactly 0.50 and is rank 1", () => {
    const [only] = rankVisibilityCandidates([candidate(veg[0]!)]).results;
    expect(only?.score).toBe(0.5);
    expect(only?.rank).toBe(1);
  });

  test("An empty feed returns no results", () => {
    expect(rankVisibilityCandidates([]).results).toEqual([]);
  });
});

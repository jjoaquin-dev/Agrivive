import { describe, expect, test } from "bun:test";
import { calculateAHPWeights, createVisibilityCriteria } from "./index";
import { getVisibilityTier, rankVisibilityCandidates } from "../visibility-ranking";

// Test cases follow the WSV sheet: ID | Scenario | Expected Result.
// These cover the ranking engine only. Feed, paging, sold-out and boost cases (WSV-006, 008, 009, 010) need the API and database.

const now = new Date("2026-11-01T12:00:00Z");
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 3_600_000);

type Listing = { id: string; ageHours: number; stockRatio: number; sellerReliability: number; priorCycles: number };

const candidate = (listing: Listing) => ({
  id: listing.id,
  publishedAt: hoursAgo(listing.ageHours),
  criteria: createVisibilityCriteria(listing),
});

// Five other active listings, from fresh and well stocked down to old and nearly gone.
const feed: Listing[] = [
  { id: "feed-A", ageHours: 2, stockRatio: 0.8, sellerReliability: 0.8, priorCycles: 1 },
  { id: "feed-B", ageHours: 4, stockRatio: 0.6, sellerReliability: 0.7, priorCycles: 0 },
  { id: "feed-C", ageHours: 8, stockRatio: 0.5, sellerReliability: 0.6, priorCycles: 2 },
  { id: "feed-D", ageHours: 10, stockRatio: 0.3, sellerReliability: 0.5, priorCycles: 0 },
  { id: "feed-E", ageHours: 11, stockRatio: 0.2, sellerReliability: 0.5, priorCycles: 1 },
];

function rankWithFeed(...added: Listing[]) {
  return rankVisibilityCandidates([...feed, ...added].map(candidate)).results;
}

const find = (results: ReturnType<typeof rankWithFeed>, id: string) => results.find((result) => result.id === id)!;

describe("AHP weights", () => {
  test("Weights are freshness 0.40, stock 0.30, seller 0.20, repeat supply 0.10 and consistent", () => {
    const { weights, consistencyRatio } = calculateAHPWeights();
    expect(weights.freshness).toBeCloseTo(0.4, 5);
    expect(weights.stockAvailability).toBeCloseTo(0.3, 5);
    expect(weights.sellerReliability).toBeCloseTo(0.2, 5);
    expect(weights.recurrence).toBeCloseTo(0.1, 5);
    expect(consistencyRatio).toBeLessThan(0.1);
  });
});

describe("TOPSIS ranking", () => {
  test("WSV-001 | Fresh tomatoes, full stock, well-rated seller | Priority Boost (0.60+) and first in the feed", () => {
    const tomato = find(rankWithFeed({ id: "tomato", ageHours: 0.05, stockRatio: 1, sellerReliability: 0.9, priorCycles: 0 }), "tomato");
    expect(tomato.tier).toBe("Priority Boost");
    expect(tomato.score).toBeGreaterThanOrEqual(0.6);
    expect(tomato.rank).toBe(1);
  });

  test("WSV-002 | Cabbage, 6 hours old, half stock, average seller | Standard Exposure (0.40 to 0.59), middle of the feed", () => {
    const results = rankWithFeed({ id: "cabbage", ageHours: 6, stockRatio: 0.5, sellerReliability: 0.6, priorCycles: 0 });
    const cabbage = find(results, "cabbage");
    expect(cabbage.tier).toBe("Standard Exposure");
    expect(cabbage.score).toBeGreaterThanOrEqual(0.4);
    expect(cabbage.score).toBeLessThan(0.6);
    expect(cabbage.rank).toBeGreaterThan(1);
    expect(cabbage.rank).toBeLessThan(results.length);
  });

  test("WSV-003 | Eggplant, over 12 hours old, 1 of 20 kg left, low-rated seller | Basic/Hold (below 0.40), last in the feed", () => {
    const results = rankWithFeed({ id: "eggplant", ageHours: 13, stockRatio: 1 / 20, sellerReliability: 0.3, priorCycles: 0 });
    const eggplant = find(results, "eggplant");
    expect(eggplant.tier).toBe("Basic/Hold");
    expect(eggplant.score).toBeLessThan(0.4);
    expect(eggplant.rank).toBe(results.length);
  });

  test("WSV-004 | New seller with no reviews, fresh sitaw | Neutral 50% seller score and a fair rank", () => {
    const results = rankWithFeed({ id: "sitaw", ageHours: 0.05, stockRatio: 1, sellerReliability: 0.5, priorCycles: 0 });
    const sitaw = find(results, "sitaw");
    expect(sitaw.criteria.sellerReliability).toBe(0.5);
    expect(sitaw.tier).toBe("Priority Boost");
    expect(sitaw.score).toBeGreaterThan(find(results, "feed-B").score);
  });

  test("WSV-005 | Pechay from a seller with 3+ earlier listings vs a first-time seller | Repeat seller ranks higher", () => {
    const base = { ageHours: 0.5, stockRatio: 1, sellerReliability: 0.7 };
    const results = rankWithFeed({ id: "repeat", ...base, priorCycles: 3 }, { id: "first", ...base, priorCycles: 0 });
    expect(find(results, "repeat").criteria.recurrence).toBe(1);
    expect(find(results, "first").criteria.recurrence).toBe(0);
    expect(find(results, "repeat").rank).toBeLessThan(find(results, "first").rank);
  });

  test("WSV-007 | Carrots and Okra, same stock, rating and history, 5 minutes apart | Same order on every refresh, newer first", () => {
    const base = { ageHours: 1, stockRatio: 1, sellerReliability: 0.7, priorCycles: 0 };
    const okra = candidate({ id: "okra", ...base });
    const carrots = { ...candidate({ id: "carrots", ...base }), publishedAt: new Date(okra.publishedAt.getTime() - 5 * 60_000) };
    for (const input of [[okra, carrots], [carrots, okra], [okra, carrots]]) {
      const order = rankVisibilityCandidates(input).results.map((result) => result.id);
      expect(order).toEqual(["okra", "carrots"]);
    }
  });
});

describe("Edge cases", () => {
  test("A lone listing scores exactly 0.50 (Standard Exposure)", () => {
    const [only] = rankVisibilityCandidates([candidate({ id: "lone", ageHours: 0, stockRatio: 1, sellerReliability: 1, priorCycles: 0 })]).results;
    expect(only?.score).toBe(0.5);
    expect(only?.tier).toBe("Standard Exposure");
  });

  test("An empty feed returns no results", () => {
    expect(rankVisibilityCandidates([]).results).toEqual([]);
  });

  test("Freshness hits 0 at 12 hours and repeat supply caps at 3 earlier listings", () => {
    const criteria = createVisibilityCriteria({ ageHours: 30, stockRatio: 2, sellerReliability: 0.5, priorCycles: 9 });
    expect(criteria.freshness).toBe(0);
    expect(criteria.stockAvailability).toBe(1);
    expect(criteria.recurrence).toBe(1);
  });

  test("Tier cut-offs: 0.60 is Priority Boost, 0.40 is Standard Exposure, below 0.40 is Basic/Hold", () => {
    expect(getVisibilityTier(0.6)).toBe("Priority Boost");
    expect(getVisibilityTier(0.5999)).toBe("Standard Exposure");
    expect(getVisibilityTier(0.4)).toBe("Standard Exposure");
    expect(getVisibilityTier(0.3999)).toBe("Basic/Hold");
  });
});

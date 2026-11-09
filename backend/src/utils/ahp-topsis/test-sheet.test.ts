import { describe, expect, test } from "bun:test";
import { calculateAHPWeights, createVisibilityCriteria } from "./index";
import { rankVisibilityCandidates } from "../visibility-ranking";
import { pickBoostCandidate } from "../visibility-ranking/boost-select";

// One test per case that needs no database, named after the case ID in WSV-AHP-TOPSIS-test-sheet.pdf and N8N-Boost-test-sheet.pdf.

const now = new Date("2026-11-09T12:00:00Z");
type Listing = { id: string; ageHours?: number; basePrice?: number; price?: number; stock?: number; sellerRating?: number };
const make = (l: Listing) => ({
  id: l.id,
  publishedAt: new Date(now.getTime() - (l.ageHours ?? 3) * 3_600_000),
  criteria: createVisibilityCriteria({ ageHours: l.ageHours ?? 3, basePrice: l.basePrice ?? 100, price: l.price ?? 100, stock: l.stock ?? 10, sellerRating: l.sellerRating ?? 4 }),
});
// Same background feed every time, so only the listings under test differ.
const feed = [
  { id: "f1", ageHours: 1, stock: 30, sellerRating: 4.5 },
  { id: "f2", ageHours: 4, price: 90, stock: 8, sellerRating: 3.5 },
  { id: "f3", ageHours: 8, price: 70, stock: 2, sellerRating: 4 },
  { id: "f4", ageHours: 2, stock: 15, sellerRating: 5 },
  { id: "f5", ageHours: 6, price: 85, stock: 5, sellerRating: 3 },
];
const rankOf = (ranked: ReturnType<typeof rankVisibilityCandidates>, id: string) => ranked.results.find((r) => r.id === id)!.rank;
const compare = (a: Listing, b: Listing) => {
  const ranked = rankVisibilityCandidates([...feed, a, b].map(make));
  return { a: rankOf(ranked, a.id), b: rankOf(ranked, b.id) };
};

describe("AHP-TOPSIS test sheet", () => {
  test("WSV-001 weights are 0.351, 0.351, 0.189, 0.109 and the consistency ratio is under 0.10", () => {
    const { weights, consistencyRatio } = calculateAHPWeights();
    expect([weights.postingAge, weights.priceDrop, weights.stockLevel, weights.sellerReliability].map((w) => +w.toFixed(3))).toEqual([0.351, 0.351, 0.189, 0.109]);
    expect(consistencyRatio).toBeLessThan(0.1);
  });
  test("WSV-002 the older listing ranks above the newer one", () => {
    const r = compare({ id: "old", ageHours: 5 }, { id: "new", ageHours: 0 });
    expect(r.a).toBeLessThan(r.b);
  });
  test("WSV-003 the bigger price drop ranks higher", () => {
    const r = compare({ id: "drop", price: 80 }, { id: "full", price: 100 });
    expect(r.a).toBeLessThan(r.b);
  });
  test("WSV-004 more stock ranks higher", () => {
    const r = compare({ id: "big", stock: 20 }, { id: "small", stock: 2 });
    expect(r.a).toBeLessThan(r.b);
  });
  test("WSV-005 the higher-rated seller ranks higher", () => {
    const r = compare({ id: "good", sellerRating: 4.8 }, { id: "poor", sellerRating: 2 });
    expect(r.a).toBeLessThan(r.b);
  });
  test("WSV-006 a seller with no reviews counts as 2.5 out of 5 and still ranks", () => {
    const ranked = rankVisibilityCandidates([...feed, { id: "new-seller", sellerRating: 2.5 }].map(make));
    expect(ranked.results.length).toBe(feed.length + 1);
    expect(rankOf(ranked, "new-seller")).toBeGreaterThan(0);
  });
  test("WSV-007 a lone listing scores exactly 0.50", () => {
    const ranked = rankVisibilityCandidates([make({ id: "only" })]);
    expect(ranked.results[0]!.score).toBe(0.5);
  });
  test("WSV-010 listings with the same criteria keep the same order, newer first, then by id", () => {
    const a = { ...make({ id: "carrots", ageHours: 3 }), publishedAt: new Date(now.getTime() - 3 * 3_600_000) };
    const b = { ...make({ id: "okra", ageHours: 3 }), publishedAt: new Date(now.getTime() - 3 * 3_600_000 + 5 * 60_000) };
    const first = rankVisibilityCandidates([a, b]).results.map((r) => r.id);
    for (let i = 0; i < 5; i++) expect(rankVisibilityCandidates([b, a]).results.map((r) => r.id)).toEqual(first);
    expect(first[0]).toBe("okra");
  });
});

describe("n8n boost test sheet", () => {
  const ranked = [
    { id: "c1", productId: "p1", rank: 1, score: 0.9 },
    { id: "c2", productId: "p2", rank: 2, score: 0.7 },
  ];
  test("N8N-009 a listing boosted under 6 hours ago is skipped even when it ranks first", () => {
    const last = new Map([["p1", new Date(now.getTime() - 5 * 3_600_000)]]);
    expect(pickBoostCandidate(ranked, last, now).chosen?.id).toBe("c2");
  });
  test("N8N-009 the top-ranked listing is chosen once its 6 hours are over", () => {
    const last = new Map([["p1", new Date(now.getTime() - 6 * 3_600_000)]]);
    expect(pickBoostCandidate(ranked, last, now).chosen?.id).toBe("c1");
  });
  test("N8N-010 listings the caller marks as not allowed (no auto-post yes) are never picked", () => {
    expect(pickBoostCandidate(ranked, new Map(), now, new Set(["c1", "c2"])).chosen).toBeNull();
  });
});

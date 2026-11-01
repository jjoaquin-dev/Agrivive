import { describe, expect, test } from "bun:test";
import { rankMarketplaceProductsWithAHP } from "./marketplace.products.visibility";

// WSV-008 | Open the feed with more than 20 listings and load the next pages |
// Descending priority order, no duplicate produce and no skipped items.
// Pages are cut the same way marketplace.products.list.ts does: take `limit` rows, then cursor = last row.

const evaluatedAt = new Date("2026-11-01T12:00:00Z");
const hoursAgo = (hours: number) => new Date(evaluatedAt.getTime() - hours * 3_600_000);

// Lowercase hex ids shaped like the real uuids.
const uuid = (n: number) => `00000000-0000-4000-8000-${n.toString(16).padStart(12, "0")}`;

function makeRow(n: number, ageHours: number, stockRatio: number, extra: { publishedAt?: Date; tied?: boolean } = {}) {
  return {
    id: uuid(n),
    imagUrl: null,
    sellerId: "seller",
    distanceKm: null,
    visibilityScore: null,
    productQty: stockRatio * 10,
    originalQty: 10,
    publishedAt: extra.publishedAt ?? hoursAgo(ageHours),
    ahpPriorCycles: extra.tied ? 1 : n % 4,
    sellerReliability: extra.tied ? 0.7 : 0.5 + (n % 5) / 10,
  };
}

type Row = ReturnType<typeof makeRow>;

function loadAllPages(rows: Row[], limit: number) {
  const seen: string[] = [];
  let cursor: { score: number | null; publishedAt: Date; id: string } | null = null;
  for (let pageCount = 0; pageCount < 200; pageCount += 1) {
    const { orderedRows, scores } = rankMarketplaceProductsWithAHP(rows, evaluatedAt, cursor);
    const page = orderedRows.slice(0, limit);
    seen.push(...page.map((row) => row.id));
    const last = page[page.length - 1];
    if (orderedRows.length <= page.length || !last?.publishedAt) return seen;
    cursor = { score: scores.get(last.id) ?? null, publishedAt: last.publishedAt, id: last.id };
  }
  throw new Error("Paging never finished");
}

// 25 listings with varied age, stock and seller. Twelve of them share the same publish time, so their scores tie exactly.
const sameTime = hoursAgo(3);
const rows: Row[] = [
  ...Array.from({ length: 13 }, (_, i) => makeRow(i + 1, 0.5 + i * 0.9, 1 - i * 0.07)),
  ...Array.from({ length: 12 }, (_, i) => makeRow(i + 14, 3, 0.6, { publishedAt: sameTime, tied: true })),
];
const fullOrder = rankMarketplaceProductsWithAHP(rows, evaluatedAt, null).orderedRows.map((row) => row.id);

describe("WSV-008 marketplace paging (AHP-TOPSIS)", () => {
  test("The full ranking has every listing exactly once", () => {
    expect(fullOrder.length).toBe(25);
    expect(new Set(fullOrder).size).toBe(25);
  });

  test("The twelve listings with identical details really do tie on score", () => {
    const { scores } = rankMarketplaceProductsWithAHP(rows, evaluatedAt, null);
    const tied = rows.slice(13).map((row) => scores.get(row.id));
    expect(new Set(tied).size).toBe(1);
  });

  test("Scores go from high to low down the feed", () => {
    const { orderedRows, scores } = rankMarketplaceProductsWithAHP(rows, evaluatedAt, null);
    const values = orderedRows.map((row) => scores.get(row.id)!);
    expect(values).toEqual([...values].sort((a, b) => b - a));
  });

  for (const limit of [1, 2, 3, 5, 7, 20, 25, 50]) {
    test(`Loading ${limit} at a time gives the same list: no repeats, nothing skipped`, () => {
      expect(loadAllPages(rows, limit)).toEqual(fullOrder);
    });
  }

  test("Paging still works when a listing has no score (publish time in the future) at the end of the feed", () => {
    const withUnscored = [...rows, makeRow(99, 0, 1, { publishedAt: new Date(evaluatedAt.getTime() + 60_000) })];
    const order = rankMarketplaceProductsWithAHP(withUnscored, evaluatedAt, null).orderedRows.map((row) => row.id);
    expect(order[order.length - 1]).toBe(uuid(99));
    for (const limit of [3, 6, 26]) expect(loadAllPages(withUnscored, limit)).toEqual(order);
  });
});

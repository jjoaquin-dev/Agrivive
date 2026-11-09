import { describe, expect, test } from "bun:test";
import { boostLockHours, pickBoostCandidate } from "./boost-select";

const now = new Date("2026-11-08T12:00:00Z");
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000);
const ranked = [
  { id: "c1", productId: "sigarilyas", rank: 1, score: 0.72 },
  { id: "c2", productId: "kalabasa", rank: 2, score: 0.32 },
  { id: "c3", productId: "karot", rank: 3, score: 0.28 },
];

describe("Six-hour boost rule", () => {
  test("Nothing boosted yet: the top-ranked listing is chosen", () => {
    expect(pickBoostCandidate(ranked, new Map(), now).chosen?.productId).toBe("sigarilyas");
  });

  test("Top-ranked boosted 2 hours ago is skipped and the next-ranked is chosen", () => {
    const { chosen, locked } = pickBoostCandidate(ranked, new Map([["sigarilyas", hoursAgo(2)]]), now);
    expect(chosen?.productId).toBe("kalabasa");
    expect(locked).toHaveLength(1);
    expect(locked[0]!.lockedUntil.toISOString()).toBe(new Date(hoursAgo(2).getTime() + boostLockHours * 3_600_000).toISOString());
  });

  test("Exactly six hours is unlocked", () => {
    expect(pickBoostCandidate(ranked, new Map([["sigarilyas", hoursAgo(6)]]), now).chosen?.productId).toBe("sigarilyas");
  });

  test("Every listing still locked: nothing is chosen and all are reported locked", () => {
    const all = new Map(ranked.map((r) => [r.productId, hoursAgo(1)] as const));
    const { chosen, locked } = pickBoostCandidate(ranked, all, now);
    expect(chosen).toBeNull();
    expect(locked).toHaveLength(3);
  });

  test("Rotation: each round boosts a different vegetable", () => {
    const last = new Map<string, Date>();
    const order: string[] = [];
    for (let round = 0; round < 3; round += 1) {
      const pick = pickBoostCandidate(ranked, last, now)!.chosen!;
      order.push(pick.productId);
      last.set(pick.productId, now);
    }
    expect(order).toEqual(["sigarilyas", "kalabasa", "karot"]);
  });

  test("Listings the caller already tried are skipped", () => {
    expect(pickBoostCandidate(ranked, new Map(), now, new Set(["c1"])).chosen?.productId).toBe("kalabasa");
    expect(pickBoostCandidate(ranked, new Map(), now, new Set(["c1", "c2", "c3"])).chosen).toBeNull();
  });
});

import { describe, expect, test } from "bun:test";
import { AWAY_AFTER_MINUTES, isSellerAway } from "./seller-presence";

const now = new Date("2026-11-11T10:00:00Z");
const ago = (minutes: number) => new Date(now.getTime() - minutes * 60_000);

describe("seller presence", () => {
  test("active within 30 minutes is not away", () => {
    expect(isSellerAway(ago(1), now)).toBe(false);
    expect(isSellerAway(ago(AWAY_AFTER_MINUTES), now)).toBe(false);
  });
  test("quiet for more than 30 minutes, or never seen, is away", () => {
    expect(isSellerAway(ago(AWAY_AFTER_MINUTES + 1), now)).toBe(true);
    expect(isSellerAway(null, now)).toBe(true);
  });
});

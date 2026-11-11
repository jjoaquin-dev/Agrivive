import { describe, expect, test } from "bun:test";
import { openSpans, sumWithoutAway } from "./open-hours";

const day = (weekday: number, opensMinute = 480, closesMinute = 1200, isClosed = false) => ({ weekday, isClosed, opensMinute, closesMinute });
const week = [day(0, 480, 1200, true), day(1), day(2), day(3), day(4), day(5), day(6, 0, 1440)];
const hoursOf = (spans: [number, number][]) => spans.reduce((s, [a, b]) => s + b - a, 0) / 3_600_000;

describe("open hours counting", () => {
  test("no saved hours counts every hour", () => {
    expect(hoursOf(openSpans([], null, new Date("2026-11-09T00:00:00Z"), new Date("2026-11-10T00:00:00Z")))).toBe(24);
  });
  test("a question at 7:50 PM Monday only counts 10 minutes that night, then the next morning", () => {
    // Monday 2026-11-09 19:50 Manila = 11:50Z; Tuesday 09:00 Manila = 01:00Z on the 10th.
    const spans = openSpans(week, null, new Date("2026-11-09T11:50:00Z"), new Date("2026-11-10T01:00:00Z"));
    expect(hoursOf(spans)).toBeCloseTo(10 / 60 + 1, 5);
  });
  test("a closed day counts nothing", () => {
    // Sunday 2026-11-08 all day Manila.
    expect(openSpans(week, null, new Date("2026-11-07T16:00:00Z"), new Date("2026-11-08T15:59:00Z"))).toEqual([]);
  });
  test("a 24 hour day counts all 24 hours", () => {
    // Saturday 2026-11-14 00:00 to 24:00 Manila.
    expect(hoursOf(openSpans(week, null, new Date("2026-11-13T16:00:00Z"), new Date("2026-11-14T16:00:00Z")))).toBe(24);
  });
  test("away time is taken out of open time", () => {
    const open: [number, number][] = [[0, 10 * 3_600_000]];
    expect(sumWithoutAway(open, [[2 * 3_600_000, 5 * 3_600_000]])).toBe(7 * 3_600_000);
  });
});

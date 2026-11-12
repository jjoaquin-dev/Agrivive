import { describe, expect, test } from "bun:test";
import { reservationDeadline } from "./reservation-deadline";
import type { StallRules } from "./rules";

const at = (date: string, hhmm: string) => new Date(`${date}T${hhmm}:00+08:00`);
const week = (opens: number, closes: number, closedWeekdays: number[] = []) =>
  [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, isClosed: closedWeekdays.includes(weekday), opensMinute: opens, closesMinute: closes }));
const rules = (hours: StallRules["hours"], closedDate: string | null = null): StallRules => ({ hours, closedDate, pickupWithinMinutes: 120, capacity: 3 });

describe("reservation deadline", () => {
  test("24 hours open: pick up 24 hours after reserving", () => {
    const deadline = reservationDeadline(rules(week(0, 1440)), at("2026-09-17", "06:00"));
    expect(deadline.end.getTime()).toBe(at("2026-09-18", "06:00").getTime());
    expect(deadline.qrUntil.getTime()).toBe(deadline.end.getTime()); // QR dies at the deadline
    expect(deadline.is24Hours).toBe(true);
  });
  test("no hours saved counts as open all day", () => {
    expect(reservationDeadline(rules([]), at("2026-09-17", "06:00")).end.getTime()).toBe(at("2026-09-18", "06:00").getTime());
  });
  test("set hours: pick up 30 minutes before closing, QR works until closing", () => {
    const deadline = reservationDeadline(rules(week(360, 1200)), at("2026-09-17", "09:00"));
    expect(deadline.end.getTime()).toBe(at("2026-09-17", "19:30").getTime());
    expect(deadline.qrUntil.getTime()).toBe(at("2026-09-17", "20:00").getTime());
  });
  test("inside the last 30 minutes moves to the next open day", () => {
    expect(reservationDeadline(rules(week(360, 1200)), at("2026-09-17", "19:45")).end.getTime()).toBe(at("2026-09-18", "19:30").getTime());
  });
  test("a closed day is skipped", () => {
    // 2026-09-17 is a Thursday (4); closed Thursday means Friday.
    expect(reservationDeadline(rules(week(360, 1200, [4])), at("2026-09-17", "09:00")).end.getTime()).toBe(at("2026-09-18", "19:30").getTime());
  });
  test("a stall closed every day is refused", () => {
    expect(() => reservationDeadline(rules(week(360, 1200, [0, 1, 2, 3, 4, 5, 6])), at("2026-09-17", "09:00"))).toThrow();
  });
});

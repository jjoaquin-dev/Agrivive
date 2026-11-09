import { describe, expect, test } from "bun:test";
import { AUTO_CONFIRM_HOURS, autoConfirmDeadline, isLateCancellation, qrStatus, qrWindow } from "./qr-window";
import { addDaysKey, bookableDateKeys, manilaInstant, manilaParts } from "./manila";
import { dayWindow, rangeCells, rangesOverlap, validatePickupRange, type StallRules } from "./rules";

// Manila is UTC+8, so 8:00 AM in Manila is 00:00 UTC.
const at = (date: string, hhmm: string) => new Date(`${date}T${hhmm}:00+08:00`);
const allDays = (opens = 8 * 60, closes = 20 * 60) => [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, isClosed: false, opensMinute: opens, closesMinute: closes }));
const rules = (extra: Partial<StallRules> = {}): StallRules => ({ hours: allDays(), closedDate: null, pickupWithinMinutes: 120, capacity: 3, ...extra });
const NOW = at("2026-11-09", "07:00"); // a Monday, 7 AM in Manila
const code = (fn: () => void) => { try { fn(); } catch (error) { return (error as { statusCode: number }).statusCode; } return 0; };

describe("Philippine time", () => {
  test("a UTC evening is already tomorrow in Manila", () => {
    expect(manilaParts(new Date("2026-11-09T17:00:00Z"))).toMatchObject({ dateKey: "2026-11-10", minute: 60 });
    expect(manilaInstant("2026-11-09", 8 * 60).toISOString()).toBe("2026-11-09T00:00:00.000Z");
  });
  test("buyers can pick up today or tomorrow only", () => {
    expect(bookableDateKeys(NOW)).toEqual(["2026-11-09", "2026-11-10"]);
    expect(addDaysKey("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("QR validity", () => {
  const start = at("2026-11-09", "08:00");
  const end = at("2026-11-09", "09:00");
  test("the QR ends 15 minutes after the slot end", () => {
    expect(qrWindow(start, end).validUntil).toEqual(at("2026-11-09", "09:15"));
  });
  test("an early buyer is never turned away: valid hours before the slot and at its start", () => {
    expect(qrStatus(start, end, new Date(start.getTime() - 1000))).toBe("active");
    expect(qrStatus(start, end, new Date(start.getTime() - 5 * 3_600_000))).toBe("active");
    expect(qrStatus(start, end, start)).toBe("active");
  });
  test("still valid at exactly 9:15, expired one second later", () => {
    expect(qrStatus(start, end, at("2026-11-09", "09:15"))).toBe("active");
    expect(qrStatus(start, end, new Date(at("2026-11-09", "09:15").getTime() + 1000))).toBe("expired");
  });
  test("valid at the end of the slot itself", () => expect(qrStatus(start, end, end)).toBe("active"));
});

describe("3-hour rules", () => {
  test("automatic confirmation is due exactly 3 hours after the order was placed", () => {
    const placed = new Date("2026-11-09T01:00:00Z");
    expect(AUTO_CONFIRM_HOURS).toBe(3);
    expect(autoConfirmDeadline(placed).toISOString()).toBe("2026-11-09T04:00:00.000Z");
  });
  test("a cancellation exactly 3 hours before pickup is late, 3 hours and 1 second before is not", () => {
    const pickup = at("2026-11-09", "12:00");
    expect(isLateCancellation(pickup, at("2026-11-09", "09:00"))).toBe(true);
    expect(isLateCancellation(pickup, new Date(at("2026-11-09", "09:00").getTime() - 1000))).toBe(false);
    expect(isLateCancellation(null)).toBe(false);
  });
});

describe("slot overlap", () => {
  const a = { start: at("2026-11-09", "08:00"), end: at("2026-11-09", "09:00") };
  test("touching ranges do not overlap, one minute of sharing does", () => {
    expect(rangesOverlap(a, { start: at("2026-11-09", "09:00"), end: at("2026-11-09", "10:00") })).toBe(false);
    expect(rangesOverlap(a, { start: at("2026-11-09", "08:59"), end: at("2026-11-09", "10:00") })).toBe(true);
    expect(rangesOverlap(a, a)).toBe(true);
  });
  test("a range is cut into 15-minute cells", () => expect(rangeCells(a)).toHaveLength(4));
});

describe("opening hours and pickup range rules", () => {
  const ok = { start: at("2026-11-09", "09:00"), end: at("2026-11-09", "10:00") };
  test("a range inside the hours is accepted", () => expect(code(() => validatePickupRange(ok, rules(), NOW))).toBe(0));
  test("a stall with no hours cannot be reserved", () => expect(code(() => validatePickupRange(ok, rules({ hours: [] }), NOW))).toBe(409));
  test("before opening is refused, at opening is accepted", () => {
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "07:45"), end: at("2026-11-09", "08:30") }, rules(), NOW))).toBe(409);
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "08:00"), end: at("2026-11-09", "08:30") }, rules(), at("2026-11-09", "07:00")))).toBe(0);
  });
  test("the last 30 minutes before closing cannot be booked", () => {
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "18:30"), end: at("2026-11-09", "19:30") }, rules(), NOW))).toBe(0);
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "19:00"), end: at("2026-11-09", "19:45") }, rules(), NOW))).toBe(409);
  });
  test("a closed weekday is unavailable", () => {
    const monday = allDays().map((day) => (day.weekday === 1 ? { ...day, isClosed: true } : day));
    expect(code(() => validatePickupRange(ok, rules({ hours: monday }), NOW))).toBe(409);
    expect(dayWindow(rules({ hours: monday }), "2026-11-09").open).toBe(false);
    expect(dayWindow(rules({ hours: monday }), "2026-11-10").open).toBe(true);
  });
  test("Closed today hides that date only and leaves the weekly hours alone", () => {
    const closed = rules({ closedDate: "2026-11-09" });
    expect(code(() => validatePickupRange(ok, closed, NOW))).toBe(409);
    expect(code(() => validatePickupRange({ start: at("2026-11-10", "09:00"), end: at("2026-11-10", "10:00") }, closed, NOW))).toBe(0);
    expect(closed.hours).toHaveLength(7);
  });
  test("the day after tomorrow is refused", () => {
    expect(code(() => validatePickupRange({ start: at("2026-11-11", "09:00"), end: at("2026-11-11", "10:00") }, rules(), NOW))).toBe(400);
  });
  test("a start in the past is refused", () => {
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "09:00"), end: at("2026-11-09", "10:00") }, rules(), at("2026-11-09", "09:30")))).toBe(400);
  });
  test("the range cannot be longer than the seller's limit, exactly the limit is fine", () => {
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "09:00"), end: at("2026-11-09", "11:00") }, rules(), NOW))).toBe(0);
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "09:00"), end: at("2026-11-09", "11:15") }, rules(), NOW))).toBe(400);
  });
  test("times must be in 15-minute steps and end after the start", () => {
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "09:05"), end: at("2026-11-09", "10:00") }, rules(), NOW))).toBe(400);
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "10:00"), end: at("2026-11-09", "09:00") }, rules(), NOW))).toBe(400);
  });
  test("every seller chooses their own hours", () => {
    const short = rules({ hours: allDays(9 * 60, 12 * 60) });
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "11:00"), end: at("2026-11-09", "11:30") }, short, NOW))).toBe(0);
    expect(code(() => validatePickupRange({ start: at("2026-11-09", "11:15"), end: at("2026-11-09", "12:00") }, short, NOW))).toBe(409);
  });
});

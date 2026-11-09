import { describe, expect, test } from "bun:test";
import { heatAlertFor, heatAlertThresholdC, holidayAlertDaysAhead, holidayDueForAlert, manilaDate } from "./index";

// 2026-11-29 20:00 UTC is already 2026-11-30 04:00 in the Philippines.
const lateUtc = new Date("2026-11-29T20:00:00Z");

describe("holiday alert", () => {
  test("alerts exactly one day ahead", () => {
    expect(holidayAlertDaysAhead).toBe(1);
    const holidays = [{ date: "2026-12-01", name: "Tomorrow Day" }, { date: "2026-12-08", name: "Later" }];
    expect(holidayDueForAlert(holidays, lateUtc)?.name).toBe("Tomorrow Day");
  });
  test("no alert two days ahead, today, or in the past", () => {
    for (const date of ["2026-12-02", "2026-11-30", "2026-11-29"]) expect(holidayDueForAlert([{ date }], lateUtc)).toBeNull();
  });
  test("uses the Philippine date, not the UTC date", () => {
    expect(manilaDate(lateUtc)).toBe("2026-11-30");
    expect(manilaDate(new Date("2026-11-29T10:00:00Z"))).toBe("2026-11-29");
    expect(holidayDueForAlert([{ date: "2026-11-30" }], new Date("2026-11-29T10:00:00Z"))).not.toBeNull();
  });
  test("handles no holidays", () => {
    expect(holidayDueForAlert(undefined)).toBeNull();
    expect(holidayDueForAlert([])).toBeNull();
  });
});

describe("heat alert", () => {
  const day = (date: string, max: number) => ({ date, temperatureMaxC: max });
  test("threshold is 35 °C and 35 triggers", () => {
    expect(heatAlertThresholdC).toBe(35);
    expect(heatAlertFor([day("2026-11-30", 35)], lateUtc)).toEqual({ temperatureMaxC: 35, when: "today" });
    expect(heatAlertFor([day("2026-11-30", 34.9)], lateUtc)).toBeNull();
  });
  test("names today, tomorrow or the date, and picks the earliest hot day", () => {
    expect(heatAlertFor([day("2026-12-02", 37), day("2026-12-01", 36.4)], lateUtc)).toEqual({ temperatureMaxC: 36, when: "tomorrow" });
    expect(heatAlertFor([day("2026-12-02", 37)], lateUtc)).toEqual({ temperatureMaxC: 37, when: "on December 2" });
  });
  test("ignores past days and empty forecasts", () => {
    expect(heatAlertFor([day("2026-11-29", 40)], lateUtc)).toBeNull();
    expect(heatAlertFor([], lateUtc)).toBeNull();
    expect(heatAlertFor(undefined, lateUtc)).toBeNull();
  });
});

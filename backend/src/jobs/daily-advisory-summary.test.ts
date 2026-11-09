import { describe, expect, test } from "bun:test";
import { manilaDate } from "../utils/advisory-alerts";
import { buildDailyAdvisorySummary } from "./daily-advisory-summary";

const base = (over: object) => ({
  generatedAt: new Date().toISOString(), location: null, reminders: [], sources: { weather: "available", holidays: "available" },
  weather: { available: true, current: { temperatureC: 31.4, precipitationProbability: 20, weatherCode: 1 }, forecast: [] },
  holidays: { available: true, upcoming: [] }, ...over,
}) as never;

describe("daily summary", () => {
  test("adds a heat alert and says tomorrow for a holiday one day away", () => {
    const text = buildDailyAdvisorySummary(base({
      weather: { available: true, current: { temperatureC: 36, precipitationProbability: 0, weatherCode: 0 }, forecast: [{ date: manilaDate(), temperatureMaxC: 36.2, temperatureMinC: 26, precipitationProbability: 0, weatherCode: 0 }] },
      holidays: { available: true, upcoming: [{ date: manilaDate(new Date(), 1), name: "Bonifacio Day", localName: "x" }] },
    }));
    expect(text).toContain("Heat alert: it may reach 36°C today.");
    expect(text).toContain("Tomorrow is Bonifacio Day.");
    expect(text).not.toContain("Next holiday");
  });
  test("a farther holiday keeps the normal wording and no heat line when it is cool", () => {
    const text = buildDailyAdvisorySummary(base({ holidays: { available: true, upcoming: [{ date: manilaDate(new Date(), 5), name: "Later Day", localName: "x" }] } }));
    expect(text).toContain("Next holiday: Later Day on");
    expect(text).not.toContain("Heat alert");
  });
});

/** Sellers are warned this many days before a public holiday. */
export const holidayAlertDaysAhead = 1;
/** A forecast day at or above this temperature (°C) triggers the heat alert. */
export const heatAlertThresholdC = 35;

const manilaOffsetMs = 8 * 3_600_000;

/** The calendar date in the Philippines (UTC+8, no daylight saving), `daysAhead` days from `now`, as YYYY-MM-DD. */
export function manilaDate(now: Date = new Date(), daysAhead = 0): string {
  return new Date(now.getTime() + manilaOffsetMs + daysAhead * 86_400_000).toISOString().slice(0, 10);
}

/** The holiday that falls exactly `holidayAlertDaysAhead` days from today, if any. */
export function holidayDueForAlert<T extends { date: string }>(holidays: T[] | undefined, now: Date = new Date()): T | null {
  const target = manilaDate(now, holidayAlertDaysAhead);
  return holidays?.find((holiday) => holiday.date === target) ?? null;
}

/** The first forecast day that reaches the heat threshold, with a plain "today" / "tomorrow" / date label. */
export function heatAlertFor(
  forecast: { date: string; temperatureMaxC: number }[] | undefined,
  now: Date = new Date(),
): { temperatureMaxC: number; when: string } | null {
  const today = manilaDate(now);
  const hot = (forecast ?? []).filter((day) => day.date >= today && day.temperatureMaxC >= heatAlertThresholdC)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  if (!hot) return null;
  const when = hot.date === today ? "today" : hot.date === manilaDate(now, 1) ? "tomorrow"
    : `on ${new Date(`${hot.date}T00:00:00Z`).toLocaleDateString("en-PH", { month: "long", day: "numeric", timeZone: "UTC" })}`;
  return { temperatureMaxC: Math.round(hot.temperatureMaxC), when };
}

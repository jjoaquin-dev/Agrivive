/** All pickup times use Philippine time (Asia/Manila, UTC+8, no daylight saving). */
const MANILA_OFFSET_MS = 8 * 3_600_000;
export const MINUTE_MS = 60_000;

export function manilaParts(date: Date) {
  const shifted = new Date(date.getTime() + MANILA_OFFSET_MS);
  return {
    dateKey: shifted.toISOString().slice(0, 10),
    weekday: shifted.getUTCDay(),
    minute: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
}

export function manilaDateKey(date: Date) {
  return manilaParts(date).dateKey;
}

/** The instant for a Manila date ("2026-11-09") and a minute after midnight. */
export function manilaInstant(dateKey: string, minute: number) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!) + minute * MINUTE_MS - MANILA_OFFSET_MS);
}

export function addDaysKey(dateKey: string, days: number) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d! + days)).toISOString().slice(0, 10);
}

/** Buyers can only pick up today or tomorrow, so produce is not held for long. */
export function bookableDateKeys(now: Date) {
  const today = manilaDateKey(now);
  return [today, addDaysKey(today, 1)];
}

export function formatManilaTime(date: Date) {
  const { minute } = manilaParts(date);
  const h = Math.floor(minute / 60);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(minute % 60).padStart(2, "0")} ${suffix}`;
}

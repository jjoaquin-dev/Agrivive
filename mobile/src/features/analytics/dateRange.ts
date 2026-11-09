export type DateRange = { from: string; to: string };

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-11-08" from a local calendar date, so the day the seller taps is the day that is sent. */
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** The last `days` days, ending today. */
export function lastDays(days: number): DateRange {
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - days);
  return { from: dateKey(start), to: dateKey(end) };
}

export function formatRange(range: DateRange) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const from = parseKey(range.from);
  const to = parseKey(range.to);
  const last = to.toLocaleDateString([], { ...opts, year: "numeric" });
  return range.from === range.to ? last : `${from.toLocaleDateString([], opts)} – ${last}`;
}

import type { OverviewBucket } from "../model/marketplace.overview";

const dayMs = 86_400_000;
const manilaOffsetMs = 8 * 3_600_000;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const maxDays = 366;

export type OverviewPeriod = {
  /** First and last day, as YYYY-MM-DD on the Asia/Manila calendar, both included. */
  from: string;
  to: string;
  since: Date;
  until: Date;
  days: number;
  bucket: OverviewBucket;
};

const toMs = (day: string) => Date.parse(`${day}T00:00:00Z`);
const toDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const isRealDay = (value: string | undefined): value is string => Boolean(value && datePattern.test(value) && toDay(toMs(value)) === value);

/**
 * The days a visitor asked for. A missing or odd date falls back to the last 28 days, a future end is cut to today,
 * and a span longer than a year is cut to the latest 366 days. Days count in Asia/Manila time.
 */
export function resolveOverviewPeriod(query: { from?: string; to?: string }, now = new Date()): OverviewPeriod {
  const today = toDay(now.getTime() + manilaOffsetMs);
  let to = isRealDay(query.to) && query.to < today ? query.to : today;
  let from = isRealDay(query.from) ? query.from : toDay(toMs(to) - 27 * dayMs);
  if (from > to) [from, to] = [to, from];
  if (toMs(to) - toMs(from) > (maxDays - 1) * dayMs) from = toDay(toMs(to) - (maxDays - 1) * dayMs);

  const days = Math.round((toMs(to) - toMs(from)) / dayMs) + 1;
  return {
    from,
    to,
    since: new Date(`${from}T00:00:00+08:00`),
    until: new Date(`${to}T23:59:59.999+08:00`),
    days,
    // Short spans show every day, medium ones show weeks, long ones show months, so a chart never has too many bars.
    bucket: days <= 31 ? "day" : days <= 98 ? "week" : "month",
  };
}

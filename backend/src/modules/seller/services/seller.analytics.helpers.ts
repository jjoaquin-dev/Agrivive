import { OrderError } from "../../../utils/order-types";
import type { SellerAnalyticsQuery } from "../model/seller.analytics";

export type AnalyticsPeriod = {
  start: Date;
  end: Date;
  from: string;
  to: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function dateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function startOfUtcDay(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || dateOnly(date) !== value) {
    throw new OrderError(400, "Analytics dates must use YYYY-MM-DD format");
  }
  return date;
}

export function resolvePeriod(query: SellerAnalyticsQuery) {
  if ((query.from && !query.to) || (!query.from && query.to)) {
    throw new OrderError(400, "Analytics requires both from and to dates");
  }

  const todayStart = startOfUtcDay(dateOnly(new Date()));
  const end = query.to ? new Date(startOfUtcDay(query.to).getTime() + DAY_MS) : todayStart;
  const start = query.from
    ? startOfUtcDay(query.from)
    : new Date(end.getTime() - 30 * DAY_MS);

  if (start >= end) {
    throw new OrderError(400, "Analytics from date must be before the to date");
  }

  const duration = end.getTime() - start.getTime();
  const previousStart = new Date(start.getTime() - duration);
  return {
    current: { start, end, from: dateOnly(start), to: dateOnly(new Date(end.getTime() - DAY_MS)) },
    previous: {
      start: previousStart,
      end: start,
      from: dateOnly(previousStart),
      to: dateOnly(new Date(start.getTime() - DAY_MS)),
    },
  };
}

export function scaledDecimal(value: string | number | null | undefined): bigint {
  if (value === null || value === undefined) return 0n;
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(String(value));
  if (!match) return 0n;
  const cents = BigInt(match[2]) * 100n + BigInt((match[3] ?? "").padEnd(2, "0") || "0");
  return match[1] ? -cents : cents;
}

export function formatScaled(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const absolute = value < 0n ? -value : value;
  return `${sign}${absolute / 100n}.${(absolute % 100n).toString().padStart(2, "0")}`;
}

export function percentage(numerator: bigint, denominator: bigint): number | null {
  if (denominator === 0n) return null;
  return Number((numerator * 10_000n) / denominator) / 100;
}

export function inPeriod(value: Date | null, period: AnalyticsPeriod): boolean {
  return value !== null && value >= period.start && value < period.end;
}

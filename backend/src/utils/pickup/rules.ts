import { OrderError } from "../order-types";
import { MINUTE_MS, addDaysKey, bookableDateKeys, manilaDateKey, manilaParts } from "./manila";

export const PICKUP_STEP_MINUTES = 15;
/** The last 30 minutes before closing cannot be booked. */
export const CLOSING_BUFFER_MINUTES = 30;

export type DayHours = { weekday: number; isClosed: boolean; opensMinute: number; closesMinute: number };
export type StallRules = { hours: DayHours[]; closedDate: string | null; pickupWithinMinutes: number; capacity: number };
export type Range = { start: Date; end: Date };

export const rangesOverlap = (a: Range, b: Range) => a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();

/** A stall set to 24 hours never closes, so it has no closing buffer. */
export const is24Hours = (day: { opensMinute: number; closesMinute: number }) => day.opensMinute === 0 && day.closesMinute === 1440;

/** The bookable minutes of one Manila date, or a reason it is closed. */
export function dayWindow(rules: StallRules, dateKey: string) {
  if (rules.closedDate === dateKey) return { open: false as const, reason: "The stall is closed on this day." };
  const weekday = new Date(`${dateKey}T00:00:00Z`).getUTCDay();
  const day = rules.hours.find((row) => row.weekday === weekday);
  if (!day || day.isClosed) return { open: false as const, reason: "The stall is closed on this day." };
  return { open: true as const, opensMinute: day.opensMinute, latestEndMinute: is24Hours(day) ? 1440 : day.closesMinute - CLOSING_BUFFER_MINUTES };
}

/** Every rule that depends only on the stall, the clock and the chosen range. Capacity and buyer conflicts are checked against the database. */
export function validatePickupRange(range: Range, rules: StallRules, now: Date) {
  if (!rules.hours.length) throw new OrderError(409, "This stall has not set its opening hours yet.");
  const { start, end } = range;
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    throw new OrderError(400, "Choose a pickup time where the end is after the start.");
  }
  const startParts = manilaParts(start);
  const endParts = manilaParts(end);
  const sameDay = startParts.dateKey === endParts.dateKey || (endParts.minute === 0 && addDaysKey(startParts.dateKey, 1) === endParts.dateKey);
  if (!sameDay) throw new OrderError(400, "Pickup must start and end on the same day.");
  if (!bookableDateKeys(now).includes(startParts.dateKey)) {
    throw new OrderError(400, "You can only pick up today or tomorrow, so produce is not held for too long.");
  }
  if (start.getTime() < now.getTime()) throw new OrderError(400, "That pickup time has already started. Choose a later time.");
  const startsOnStep = startParts.minute % PICKUP_STEP_MINUTES === 0 && start.getUTCSeconds() === 0;
  const endsOnStep = endParts.minute % PICKUP_STEP_MINUTES === 0 && end.getUTCSeconds() === 0;
  if (!startsOnStep || !endsOnStep) throw new OrderError(400, `Pickup times must be in ${PICKUP_STEP_MINUTES}-minute steps.`);
  const minutes = (end.getTime() - start.getTime()) / MINUTE_MS;
  if (minutes > rules.pickupWithinMinutes) {
    throw new OrderError(400, `This stall allows a pickup range of up to ${rules.pickupWithinMinutes} minutes.`);
  }
  const window = dayWindow(rules, startParts.dateKey);
  if (!window.open) throw new OrderError(409, window.reason);
  const endMinute = endParts.dateKey === startParts.dateKey ? endParts.minute : 24 * 60;
  if (startParts.minute < window.opensMinute || endMinute > window.latestEndMinute) {
    throw new OrderError(409, "That time is outside the stall's pickup hours. The last 30 minutes before closing cannot be booked.");
  }
}

/** The 15-minute cells a range covers, used for capacity counting. */
export function rangeCells(range: Range) {
  const cells: Date[] = [];
  for (let t = range.start.getTime(); t < range.end.getTime(); t += PICKUP_STEP_MINUTES * MINUTE_MS) cells.push(new Date(t));
  return cells;
}

export { manilaDateKey };

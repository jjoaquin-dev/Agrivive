import { OrderError } from "../order-types";
import { MINUTE_MS, addDaysKey, manilaInstant, manilaParts } from "./manila";
import { CLOSING_BUFFER_MINUTES, is24Hours, type StallRules } from "./rules";

const DAY_MINUTES = 24 * 60;

/**
 * When a new reservation must be picked up (`end`) and when its QR stops working (`qrUntil`). The buyer no longer picks a slot.
 * - 24 hours open today (or no hours saved): both are 24 hours after reserving.
 * - Set hours: `end` is 30 minutes before closing, `qrUntil` is closing time (a seller may still hand over late).
 *   Today's hours are used, or the next open day's when today is over or closed.
 */
export function reservationDeadline(rules: StallRules, now: Date) {
  const today = manilaParts(now);
  const todayRow = rules.hours.find((row) => row.weekday === today.weekday);
  const openAllDay = !rules.hours.length || (todayRow && !todayRow.isClosed && is24Hours(todayRow) && rules.closedDate !== today.dateKey);
  if (openAllDay) {
    const end = new Date(now.getTime() + DAY_MINUTES * MINUTE_MS);
    return { end, qrUntil: end, is24Hours: true, opensMinute: 0, closesMinute: DAY_MINUTES };
  }

  for (let offset = 0; offset < 8; offset += 1) {
    const dateKey = addDaysKey(today.dateKey, offset);
    const row = rules.hours.find((item) => item.weekday === new Date(`${dateKey}T00:00:00Z`).getUTCDay());
    if (!row || row.isClosed || rules.closedDate === dateKey) continue;
    const lastMinute = is24Hours(row) ? DAY_MINUTES : row.closesMinute - CLOSING_BUFFER_MINUTES;
    if (offset === 0 && today.minute >= lastMinute) continue;
    const end = manilaInstant(dateKey, lastMinute);
    return { end, qrUntil: is24Hours(row) ? end : manilaInstant(dateKey, row.closesMinute), is24Hours: is24Hours(row), opensMinute: row.opensMinute, closesMinute: row.closesMinute };
  }
  throw new OrderError(409, "This stall has no open days right now. Please try again later.");
}

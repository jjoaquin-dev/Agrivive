import { eq } from "drizzle-orm";
import { seller_opening_hours } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { awayIntervals } from "./away";
import { addDaysKey, manilaDateKey, manilaInstant } from "./manila";

type Span = [number, number];
type DayHours = { weekday: number; isClosed: boolean; opensMinute: number; closesMinute: number };

/** The stretches between `since` and `now` when the stall's weekly hours say it is open. No hours saved means open all the time. */
export function openSpans(hours: DayHours[], closedDate: string | null, since: Date, now: Date): Span[] {
  const from = since.getTime();
  const to = now.getTime();
  if (to <= from) return [];
  if (!hours.length) return [[from, to]];
  const spans: Span[] = [];
  const last = manilaDateKey(now);
  for (let key = manilaDateKey(since); key <= last; key = addDaysKey(key, 1)) {
    const day = hours.find((row) => row.weekday === new Date(`${key}T00:00:00Z`).getUTCDay());
    if (!day || day.isClosed || key === closedDate) continue;
    const start = Math.max(from, manilaInstant(key, day.opensMinute).getTime());
    const end = Math.min(to, manilaInstant(key, day.closesMinute).getTime());
    if (end > start) spans.push([start, end]);
  }
  return spans;
}

/** Removes the Away stretches from the open stretches and adds up what is left. */
export function sumWithoutAway(open: Span[], away: Span[]) {
  let total = 0;
  for (const [start, end] of open) {
    let left = end - start;
    for (const [awayStart, awayEnd] of away) {
      const overlap = Math.min(end, awayEnd) - Math.max(start, awayStart);
      if (overlap > 0) left -= overlap;
    }
    total += Math.max(0, left);
  }
  return total;
}

/** How long the seller has really been waited on: only time the stall was open and the seller was not Away. */
export async function countedWaitMs(tx: OrderTransaction, sellerId: string, since: Date, now: Date) {
  const hours = await tx.select().from(seller_opening_hours).where(eq(seller_opening_hours.sellerId, sellerId));
  const open = openSpans(hours, null, since, now);
  return sumWithoutAway(open, await awayIntervals(tx, sellerId, since, now));
}

import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_opening_hours } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import type { StallHoursBody } from "../model/pickup.stall";
import { readStall } from "./pickup.stall.read";

/** Replaces the weekly schedule. Each seller sets their own hours; a day can be closed. */
export async function saveStallHours(sellerId: string, body: StallHoursBody) {
  const seen = new Set<number>();
  for (const day of body.days) {
    if (seen.has(day.weekday)) throw new OrderError(400, "Each day can only appear once.");
    seen.add(day.weekday);
    if (!day.isClosed && day.closesMinute - day.opensMinute < 60) {
      throw new OrderError(400, "Open at least 1 hour on days the stall is open.");
    }
  }
  await db.transaction(async (tx) => {
    await tx.delete(seller_opening_hours).where(eq(seller_opening_hours.sellerId, sellerId));
    await tx.insert(seller_opening_hours).values(body.days.map((day) => ({
      sellerId, weekday: day.weekday, isClosed: day.isClosed,
      opensMinute: day.isClosed ? 480 : day.opensMinute, closesMinute: day.isClosed ? 480 : day.closesMinute,
    })));
  });
  return readStall(sellerId);
}

import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_profile } from "../../../db/schema";
import { manilaDateKey } from "../../../utils/pickup/manila";
import { readStall } from "./pickup.stall.read";

/** "Closed today" hides today's pickup times. The weekly hours are not touched, and the switch turns itself off tomorrow. */
export async function setClosedToday(sellerId: string, closed: boolean) {
  await db.update(sellers_profile).set({ closedDate: closed ? manilaDateKey(new Date()) : null }).where(eq(sellers_profile.userId, sellerId));
  return readStall(sellerId);
}

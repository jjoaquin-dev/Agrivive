import { eq } from "drizzle-orm";
import { db } from "../../db";
import { user } from "../../db/schema";

const touchCache = new Map<string, number>();
const THROTTLE_MS = 5 * 60 * 1000; // 5 minutes: fine enough for the Away status (30 minutes quiet)

export async function touchUserActivity(userId: string): Promise<void> {
  const now = Date.now();
  const lastTouch = touchCache.get(userId);
  if (lastTouch && now - lastTouch < THROTTLE_MS) {
    return;
  }
  touchCache.set(userId, now);
  try {
    await db
      .update(user)
      .set({ lastActiveAt: new Date(now) })
      .where(eq(user.id, userId));
  } catch (error) {
    console.error("Failed to update lastActiveAt for user", userId, error);
  }
}

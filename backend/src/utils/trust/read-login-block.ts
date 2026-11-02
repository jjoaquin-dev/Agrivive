import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../../db";
import { trust_actions, user } from "../../db/schema";
import { pausedMessage, restrictionEnd } from "./access";
import { readAccountBlock } from "./read-account-block";

/** Why this person may not sign in right now, or null when they may. Covers blocked accounts and running pauses. */
export async function readLoginBlock(userId: string): Promise<string | null> {
  const [account] = await db.select({ isActive: user.isActive }).from(user).where(eq(user.id, userId)).limit(1);
  if (!account) return null;
  if (!account.isActive) return readAccountBlock(userId);

  const [pause] = await db.select({ reason: trust_actions.reason, endsAt: trust_actions.endsAt, createdAt: trust_actions.createdAt })
    .from(trust_actions)
    .where(and(
      eq(trust_actions.subjectId, userId),
      eq(trust_actions.actionType, "temporary_restriction"),
      isNull(trust_actions.revokedAt),
    ))
    .orderBy(desc(trust_actions.createdAt))
    .limit(1);
  if (!pause || restrictionEnd(pause.endsAt, pause.createdAt) <= new Date()) return null;
  return pausedMessage(pause.reason, pause.endsAt, pause.createdAt);
}

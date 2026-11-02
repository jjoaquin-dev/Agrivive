import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "../../db";
import { trust_actions, user } from "../../db/schema";
import { blockedMessage, pausedMessage, restrictionEnd } from "./access";

/**
 * Why an inactive account can't be used right now, or null when it can.
 * A pause that has already ended must not keep the account shut, so those are closed here
 * and the account is opened again (pauses never close an account on their own, only blocks do).
 */
export async function readAccountBlock(userId: string): Promise<string | null> {
  const open = await db.select({
    id: trust_actions.id,
    actionType: trust_actions.actionType,
    reason: trust_actions.reason,
    endsAt: trust_actions.endsAt,
    createdAt: trust_actions.createdAt,
  }).from(trust_actions).where(and(
    eq(trust_actions.subjectId, userId),
    inArray(trust_actions.actionType, ["blocked", "temporary_restriction"]),
    isNull(trust_actions.revokedAt),
  ));

  const blocked = open.find((row) => row.actionType === "blocked");
  if (blocked) return blockedMessage(blocked.reason);

  const now = new Date();
  const live = open.filter((row) => restrictionEnd(row.endsAt, row.createdAt) > now)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  if (live) return pausedMessage(live.reason, live.endsAt, live.createdAt);

  if (open.length) {
    await db.transaction(async (tx) => {
      await tx.update(trust_actions).set({ revokedAt: now, revocationReason: "Temporary restriction expired" })
        .where(inArray(trust_actions.id, open.map((row) => row.id)));
      await tx.update(user).set({ isActive: true }).where(eq(user.id, userId));
    });
    return null;
  }
  return "Your account is paused. Please restore your account to continue.";
}

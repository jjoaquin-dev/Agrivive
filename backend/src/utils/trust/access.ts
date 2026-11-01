import { and, desc, eq, gt, isNull, or } from "drizzle-orm";
import { trust_actions } from "../../db/schema";
import { OrderError, type OrderTransaction } from "../order-types";

/** The stored reason may already end with "Please come back in ...". Drop that part so the time shown is always fresh. */
const comeBackSentence = /\s*Please come back in .*$/i;
const restoreSentence = /\s*(?:Verify your email to restore|Please restore) your account.*$/i;

/** Paused: the reason that was stored when the pause began, plus how long is left. */
export function pausedMessage(reason: string, endsAt: Date | null): string {
  const remaining = formatRemainingTime(endsAt ? endsAt.getTime() - Date.now() : 0);
  return `${reason.replace(comeBackSentence, "")} Please come back in ${remaining}.`;
}

/** Blocked: the stored reason plus the way back. The app tells "blocked" from "paused" by the restore sentence. */
export function blockedMessage(reason: string): string {
  return `${reason.replace(restoreSentence, "").replace(comeBackSentence, "")} Please restore your account to continue.`;
}

export function formatRemainingTime(diffMs: number): string {
  if (diffMs <= 0) return "a few moments";
  const hours = Math.ceil(diffMs / (1000 * 60 * 60));
  if (hours > 24) {
    const days = Math.ceil(hours / 24);
    return `${days} day${days > 1 ? "s" : ""}`;
  }
  return `${hours} hour${hours > 1 ? "s" : ""}`;
}

export async function requireNoActiveTrustRestriction(tx: OrderTransaction, userId: string) {
  const [restriction] = await tx
    .select({
      id: trust_actions.id,
      endsAt: trust_actions.endsAt,
      reason: trust_actions.reason,
    })
    .from(trust_actions)
    .where(
      and(
        eq(trust_actions.subjectId, userId),
        eq(trust_actions.actionType, "temporary_restriction"),
        isNull(trust_actions.revokedAt),
        or(isNull(trust_actions.endsAt), gt(trust_actions.endsAt, new Date())),
      ),
    )
    .orderBy(desc(trust_actions.createdAt))
    .limit(1);

  if (restriction) throw new OrderError(403, pausedMessage(restriction.reason, restriction.endsAt));
}

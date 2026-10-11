import { and, eq, isNull, lte } from "drizzle-orm";
import { db } from "../../db";
import { trust_actions } from "../../db/schema";
import { queueTrustNotice } from ".";

export async function expireTrustRestrictions(limit = 100) {
  const now = new Date();
  const due = await db.select({ id: trust_actions.id }).from(trust_actions).where(and(
    eq(trust_actions.actionType, "temporary_restriction"),
    isNull(trust_actions.revokedAt),
    lte(trust_actions.endsAt, now),
  )).limit(limit);
  let expired = 0;
  for (const row of due) {
    const didExpire = await db.transaction(async (tx) => {
      const [action] = await tx.select().from(trust_actions).where(and(
        eq(trust_actions.id, row.id),
        eq(trust_actions.actionType, "temporary_restriction"),
        isNull(trust_actions.revokedAt),
        lte(trust_actions.endsAt, now),
      )).for("update").limit(1);
      if (!action) return false;
      await tx.update(trust_actions).set({
        revokedAt: now,
        revocationReason: "Temporary restriction expired",
      }).where(eq(trust_actions.id, action.id));
      if (action.sourceOrderId) await queueTrustNotice(tx, {
        noticeKey: `trust-action-expired:${action.actionKey}`,
        recipientId: action.subjectId,
        orderId: action.sourceOrderId,
        kind: "trust_action_expired",
      });
      return true;
    });
    if (didExpire) expired++;
  }
  return expired;
}

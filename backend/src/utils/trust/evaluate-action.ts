import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../../db";
import { trust_actions, trust_events, user } from "../../db/schema";
import { queueTrustNotice } from "./index";
import { trustActionReason } from "./action-reason";
import { trustActionPolicy, resolveTrustAction, resolveTrustDurationHours, trustPolicyVersion } from "./policy";
import { readTrustMonitoringScore } from "./score";

const actionNoticeKinds = {
  warning: "trust_action_warning",
  temporary_restriction: "trust_action_restriction",
  blocked: "trust_action_blocked",
} as const;

/**
 * Compares the weighted violation score with the thresholds and records the matching action (Table 18 of the paper).
 * triggerKind is the violation that caused this check, so the message names the real cause.
 */
export async function evaluateTrustAction(subjectId: string, sourceOrderId?: string | null, sourceEventKey?: string, triggerKind?: string) {
  if (!trustActionPolicy.enabled) return null;

  const monitoring = await readTrustMonitoringScore(subjectId);
  const actionType = resolveTrustAction(monitoring.weightedPoints, monitoring.seriousViolations > 0);
  if (!actionType) return null;

  const eventConditions = [
    eq(trust_events.subjectId, subjectId),
    eq(trust_events.classification, "verified"),
    isNull(trust_events.invalidatedAt),
    sourceEventKey ? eq(trust_events.eventKey, sourceEventKey) : undefined,
    !sourceEventKey && sourceOrderId ? eq(trust_events.orderId, sourceOrderId) : undefined,
  ];
  const [sourceEvent] = await db.select({ id: trust_events.id, orderId: trust_events.orderId, kind: trust_events.kind })
    .from(trust_events).where(and(...eventConditions)).orderBy(desc(trust_events.createdAt)).limit(1);
  const orderId = sourceOrderId ?? sourceEvent?.orderId ?? null;
  const sourceKey = sourceEventKey ?? sourceOrderId ?? "score";
  const actionKey = `${trustPolicyVersion}:${subjectId}:${actionType}:${sourceKey}`;

  const durationHours = resolveTrustDurationHours(monitoring.weightedPoints);
  const endsAt = actionType === "temporary_restriction" && durationHours > 0
    ? new Date(Date.now() + durationHours * 3_600_000)
    : null;

  const durationLabel = durationHours >= 72 ? "3 days" : durationHours >= 24 ? "24 hours" : "12 hours";
  const reasonText = trustActionReason(actionType, triggerKind ?? sourceEvent?.kind, durationLabel);

  return db.transaction(async (tx) => {
    const [existing] = await tx.select({ id: trust_actions.id }).from(trust_actions)
      .where(eq(trust_actions.actionKey, actionKey)).limit(1);
    if (existing) return existing;
    if (actionType === "blocked") {
      const [alreadyBlocked] = await tx.select({ id: trust_actions.id }).from(trust_actions).where(and(
        eq(trust_actions.subjectId, subjectId), eq(trust_actions.actionType, "blocked"), isNull(trust_actions.revokedAt),
      )).limit(1);
      if (alreadyBlocked) return alreadyBlocked;
    }

    const [action] = await tx.insert(trust_actions).values({
      actionKey,
      subjectId,
      actionType,
      weightedPoints: monitoring.weightedPoints,
      policyVersion: trustPolicyVersion,
      reason: reasonText,
      sourceEventId: sourceEvent?.id ?? null,
      sourceOrderId: orderId,
      endsAt,
    }).returning();
    if (!action) return null;

    if (actionType === "blocked") {
      await tx.update(user).set({ isActive: false }).where(eq(user.id, subjectId));
    }
    await queueTrustNotice(tx, {
      noticeKey: `trust-action:${actionKey}`,
      recipientId: subjectId,
      orderId: orderId ?? null,
      kind: actionNoticeKinds[actionType],
    });
    return action;
  });
}

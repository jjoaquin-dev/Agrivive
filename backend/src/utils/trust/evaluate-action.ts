import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../../db";
import { trust_actions, trust_events, user } from "../../db/schema";
import { queueTrustNotice } from "./index";
import { trustActionPolicy, resolveTrustAction, resolveTrustDurationHours, trustPolicyVersion } from "./policy";
import { readTrustMonitoringScore } from "./score";

const actionNoticeKinds = {
  warning: "trust_action_warning",
  temporary_restriction: "trust_action_restriction",
  blocked: "trust_action_blocked",
} as const;

export async function evaluateTrustAction(subjectId: string, sourceOrderId?: string, sourceEventKey?: string) {
  if (!trustActionPolicy.enabled) return null;

  const monitoring = await readTrustMonitoringScore(subjectId);
  const actionType = resolveTrustAction(monitoring.weightedPoints);
  if (!actionType) return null;

  const eventConditions = [
    eq(trust_events.subjectId, subjectId),
    eq(trust_events.classification, "verified"),
    isNull(trust_events.invalidatedAt),
    sourceEventKey ? eq(trust_events.eventKey, sourceEventKey) : undefined,
    !sourceEventKey && sourceOrderId ? eq(trust_events.orderId, sourceOrderId) : undefined,
  ];
  const [sourceEvent] = await db.select({ id: trust_events.id, orderId: trust_events.orderId })
    .from(trust_events).where(and(...eventConditions)).orderBy(desc(trust_events.createdAt)).limit(1);
  const orderId = sourceOrderId ?? sourceEvent?.orderId ?? null;
  const sourceKey = sourceEventKey ?? sourceOrderId ?? "score";
  const actionKey = `${trustPolicyVersion}:${subjectId}:${actionType}:${sourceKey}`;

  const durationHours = resolveTrustDurationHours(monitoring.weightedPoints);
  const endsAt = actionType === "temporary_restriction" && durationHours > 0
    ? new Date(Date.now() + durationHours * 3_600_000)
    : null;

  const durationLabel = durationHours >= 72 ? "3 days" : durationHours >= 24 ? "24 hours" : "12 hours";
  const reasonText = actionType === "warning"
    ? "You have missed pickups on previous reservations. To help avoid food waste, please collect your orders on time to avoid a 12-hour pause on your account."
    : `Your account is paused because previous reservations were not picked up before they expired. To help avoid food waste, reservations are temporarily paused for ${durationLabel}.`;

  return db.transaction(async (tx) => {
    const [existing] = await tx.select({ id: trust_actions.id }).from(trust_actions)
      .where(eq(trust_actions.actionKey, actionKey)).limit(1);
    if (existing) return existing;

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

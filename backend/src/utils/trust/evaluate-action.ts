import { and, desc, eq, isNull, or, gt } from "drizzle-orm";
import { db } from "../../db";
import { trust_actions, trust_events, user } from "../../db/schema";
import { queueTrustNotice } from "./index";
import { levelActionType, levelPauseHours, levelRank, type TrustLevel } from "./level";
import { describeEvent, describeLevelChange } from "./notice-text";
import { trustActionPolicy, trustPolicyVersion } from "./policy";
import { readTrustStanding, syncSellerFlags } from "./standing";

const noticeKinds = {
  notice: "trust_action_notice", warning: "trust_action_warning",
  temporary_restriction: "trust_action_restriction", blocked: "trust_action_blocked",
} as const;

/** The level an old or new action row stands for. Rows from before levels existed are read from their type and length. */
export function actionLevel(action: { level: string | null; actionType: string; startsAt: Date; endsAt: Date | null }): TrustLevel {
  if (action.level) return action.level as TrustLevel;
  if (action.actionType === "blocked") return "block";
  if (action.actionType === "warning") return "warning";
  if (action.actionType === "notice") return "notice";
  const hours = action.endsAt ? (action.endsAt.getTime() - action.startsAt.getTime()) / 3_600_000 : 72;
  return hours > 30 ? "pause_3d" : "pause_24h";
}

export const readActiveActions = (subjectId: string) => db.select().from(trust_actions).where(and(
  eq(trust_actions.subjectId, subjectId), isNull(trust_actions.revokedAt),
  or(isNull(trust_actions.endsAt), gt(trust_actions.endsAt, new Date())),
));

/**
 * Compares the person's score (and, for sellers, fault rate) with Table 3 and starts a consequence only when
 * a new event moves them UP into a higher level. Running it again, or when the score falls, never repeats a penalty.
 * triggerKind is the event that caused the check; it also gets one plain-words notice about the event itself.
 */
export async function evaluateTrustAction(subjectId: string, sourceOrderId?: string | null, sourceEventKey?: string, triggerKind?: string) {
  if (!trustActionPolicy.enabled) return null;
  const standing = await readTrustStanding(subjectId);
  await syncSellerFlags(standing);
  const role = standing.isSeller ? "seller" : "buyer";

  const [event] = sourceEventKey ? await db.select().from(trust_events).where(and(
    eq(trust_events.eventKey, sourceEventKey), eq(trust_events.classification, "verified"), isNull(trust_events.invalidatedAt))).limit(1) : [];
  const orderId = sourceOrderId ?? event?.orderId ?? null;
  const kind = triggerKind ?? event?.kind;
  const level = standing.level;
  const pauseHours = levelPauseHours(level);

  const active = await readActiveActions(subjectId);
  const highest = Math.max(0, ...active.map((row) => levelRank(actionLevel(row))));
  const moves = levelRank(level) > highest;

  if (event && kind) {
    await db.transaction((tx) => queueTrustNotice(tx, {
      noticeKey: `trust-event:${event.eventKey}`, recipientId: subjectId, orderId, kind: "trust_event",
      detail: describeEvent({ kind, weight: event.weight ?? 0, score: standing.score, level, pauseHours }),
    }));
  }
  const actionType = levelActionType(level);
  if (!actionType || !moves) return null;

  const actionKey = `${trustPolicyVersion}:${subjectId}:${level}:${sourceEventKey ?? sourceOrderId ?? "score"}`;
  const endsAt = pauseHours ? new Date(Date.now() + pauseHours * 3_600_000) : null;
  const reason = describeLevelChange(level, standing.score, role, pauseHours);
  return db.transaction(async (tx) => {
    const [existing] = await tx.select({ id: trust_actions.id }).from(trust_actions).where(eq(trust_actions.actionKey, actionKey)).limit(1);
    if (existing) return existing;
    const [sourceEvent] = event ? [event] : await tx.select().from(trust_events).where(and(
      eq(trust_events.subjectId, subjectId), eq(trust_events.classification, "verified"), isNull(trust_events.invalidatedAt),
    )).orderBy(desc(trust_events.createdAt)).limit(1);
    const [action] = await tx.insert(trust_actions).values({
      actionKey, subjectId, actionType, level, weightedPoints: standing.score, policyVersion: trustPolicyVersion,
      reason, sourceEventId: sourceEvent?.id ?? null, sourceOrderId: orderId, endsAt,
    }).returning();
    if (!action) return null;
    if (level === "block") await tx.update(user).set({ isActive: false }).where(eq(user.id, subjectId));
    await queueTrustNotice(tx, {
      noticeKey: `trust-action:${actionKey}`, recipientId: subjectId, orderId, kind: noticeKinds[actionType], detail: reason,
    });
    return action;
  });
}

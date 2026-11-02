import { and, eq, gte, sql } from "drizzle-orm";
import { orders, trust_actions } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";
import { queueTrustNotice } from "../../../utils/trust";
import {
  cancellationWarningAt,
  resolveCancellationCooldownHours,
  resolveCancellationRestrictionMessage,
  resolveCancellationWarning,
} from "../../../utils/trust/cancellation-policy";
import { trustActionPolicy, trustPolicyVersion, trustScoreWindowStart } from "../../../utils/trust/policy";

/** Counts the buyer's recent cancellations, then records a warning or a pause and tells the buyer. */
export async function applyBuyerCancellationPenalty(tx: OrderTransaction, buyerId: string, orderId: string) {
  if (!trustActionPolicy.enabled) return;

  const windowStart = trustScoreWindowStart();
  const [cancelRow] = await tx
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(and(
      eq(orders.buyersId, buyerId),
      eq(orders.status, "cancelled"),
      eq(orders.cancelledBy, "buyer"),
      windowStart ? gte(orders.cancelledAt, windowStart) : undefined,
    ));
  const cancelCount = Number(cancelRow?.count ?? 0);
  if (cancelCount < cancellationWarningAt) return;

  const cooldownHours = resolveCancellationCooldownHours(cancelCount);
  const endsAt = cooldownHours > 0 ? new Date(Date.now() + cooldownHours * 3_600_000) : null;
  const reason = endsAt
    ? resolveCancellationRestrictionMessage(cancelCount, endsAt).message
    : resolveCancellationWarning(cancelCount);
  if (!reason) return;

  const kind = endsAt ? "cancellation-restriction" : "cancellation-warning";
  const actionKey = `${trustPolicyVersion}:${buyerId}:${kind}:${cancelCount}:${orderId}`;
  await tx.insert(trust_actions).values({
    actionKey,
    subjectId: buyerId,
    actionType: endsAt ? "temporary_restriction" : "warning",
    weightedPoints: cancelCount,
    policyVersion: trustPolicyVersion,
    reason,
    sourceOrderId: orderId,
    endsAt,
  }).onConflictDoNothing({ target: trust_actions.actionKey });

  await queueTrustNotice(tx, {
    noticeKey: `trust-action:${actionKey}`,
    recipientId: buyerId,
    orderId,
    kind: endsAt ? "buyer_cancellation_restriction" : "buyer_cancellation_warning",
  });
}

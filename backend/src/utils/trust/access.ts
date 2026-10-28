import { and, desc, eq, gt, isNull, or } from "drizzle-orm";
import { trust_actions } from "../../db/schema";
import { OrderError, type OrderTransaction } from "../order-types";

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
      weightedPoints: trust_actions.weightedPoints,
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

  if (restriction) {
    const diffMs = restriction.endsAt ? restriction.endsAt.getTime() - Date.now() : 0;
    const remainingText = formatRemainingTime(diffMs);
    const durationText =
      restriction.weightedPoints >= 10
        ? "3 days"
        : restriction.weightedPoints >= 8
          ? "24 hours"
          : "12 hours";

    throw new OrderError(
      403,
      `Your account is paused because previous reservations were not picked up before they expired. To help avoid food waste, reservations are temporarily paused for ${durationText}. Please come back in ${remainingText}.`,
    );
  }
}

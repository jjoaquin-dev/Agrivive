import { and, desc, eq, gt, isNull, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { orders, trust_actions, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getAvatarDisplayUrl } from "../../../utils/s3-avatar";
import { formatRemainingTime } from "../../../utils/trust/access";
import { readTrustMonitoringScore } from "../../../utils/trust/score";
import { resolveCancellationWarning } from "../../../utils/trust/cancellation-policy";

export async function getBuyerProfile(userId: string) {
  const [account, monitoring, cancelRow] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)
      .then((rows) => rows[0]),
    readTrustMonitoringScore(userId),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(
        and(
          eq(orders.buyersId, userId),
          eq(orders.status, "cancelled"),
          eq(orders.cancelledBy, "buyer"),
        ),
      )
      .then((rows) => Number(rows[0]?.count ?? 0)),
  ]);

  if (!account) throw new OrderError(404, "Buyer profile not found");

  // Check active restriction first (cooldown lock)
  let trustRestriction: {
    message: string;
    remainingText: string;
    durationText: string;
  } | null = null;

  const [activeAction] = await db
    .select({
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

  if (activeAction) {
    const diffMs = activeAction.endsAt ? activeAction.endsAt.getTime() - Date.now() : 0;
    const remainingText = formatRemainingTime(diffMs);
    const durationText =
      activeAction.weightedPoints >= 10
        ? "3 days"
        : activeAction.weightedPoints >= 8 || activeAction.weightedPoints === 9
          ? "24 hours"
          : "12 hours";

    trustRestriction = {
      message: activeAction.reason.includes("Please come back in")
        ? activeAction.reason
        : `${activeAction.reason} Please come back in ${remainingText}.`,
      remainingText,
      durationText,
    };
  }

  // If no restriction is active, check warnings
  let warningMessage: string | null = null;
  if (!trustRestriction) {
    if (cancelRow >= 5 && cancelRow < 7) {
      warningMessage = resolveCancellationWarning(cancelRow);
    } else if (monitoring.weightedPoints >= 4 && monitoring.weightedPoints < 6) {
      warningMessage =
        "You have missed pickups on previous reservations. To help avoid food waste, please collect your orders on time to avoid a 12-hour pause on your account.";
    }
  }

  return {
    account: {
      ...account,
      image: await getAvatarDisplayUrl(account.image),
    },
    trustWarning: warningMessage,
    trustRestriction,
    cancellationsCount: cancelRow,
    missedPickupsPoints: monitoring.weightedPoints,
  };
}

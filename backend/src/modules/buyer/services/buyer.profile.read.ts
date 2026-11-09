import { and, desc, eq, gt, gte, isNull, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { orders, trust_actions, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getAvatarDisplayUrl } from "../../../utils/s3-avatar";
import { formatRemainingTime } from "../../../utils/trust/access";
import { trustActionPolicy, trustScoreWindowStart } from "../../../utils/trust/policy";
import { readTrustMonitoringScore } from "../../../utils/trust/score";
import { describeLevelChange } from "../../../utils/trust/notice-text";

export async function getBuyerProfile(userId: string) {
  const windowStart = trustScoreWindowStart();
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
          windowStart ? gte(orders.cancelledAt, windowStart) : undefined,
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
      createdAt: trust_actions.createdAt,
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
    const hours = activeAction.endsAt
      ? Math.round((activeAction.endsAt.getTime() - activeAction.createdAt.getTime()) / 3_600_000)
      : 72;
    const durationText = hours >= 72 ? "3 days" : "24 hours";

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
    if (monitoring.weightedPoints >= trustActionPolicy.warningThreshold && monitoring.weightedPoints < trustActionPolicy.tier1Threshold) {
      warningMessage = `${describeLevelChange("warning", monitoring.weightedPoints, "buyer")} Pick up on time, or cancel early, to avoid a pause.`;
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

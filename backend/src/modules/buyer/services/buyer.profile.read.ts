import { and, desc, eq, gt, isNull, or } from "drizzle-orm";
import { db } from "../../../db";
import { trust_actions, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getAvatarDisplayUrl } from "../../../utils/s3-avatar";
import { formatRemainingTime } from "../../../utils/trust/access";
import { readTrustMonitoringScore } from "../../../utils/trust/score";

export async function getBuyerProfile(userId: string) {
  const [account, monitoring] = await Promise.all([
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
  ]);

  if (!account) throw new OrderError(404, "Buyer profile not found");

  const hasWarning = monitoring.weightedPoints >= 4 && monitoring.weightedPoints < 6;
  const warningMessage = hasWarning
    ? "You have missed pickups on previous reservations. To help avoid food waste, please collect your orders on time to avoid a 12-hour pause on your account."
    : null;

  let trustRestriction: {
    message: string;
    remainingText: string;
    durationText: string;
  } | null = null;

  if (monitoring.weightedPoints >= 6) {
    const [activeAction] = await db
      .select({
        endsAt: trust_actions.endsAt,
        weightedPoints: trust_actions.weightedPoints,
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
          : activeAction.weightedPoints >= 8
            ? "24 hours"
            : "12 hours";

      trustRestriction = {
        message: `Your account is paused because previous reservations were not picked up before they expired. To help avoid food waste, reservations are temporarily paused for ${durationText}. Please come back in ${remainingText}.`,
        remainingText,
        durationText,
      };
    }
  }

  return {
    account: {
      ...account,
      image: await getAvatarDisplayUrl(account.image),
    },
    trustWarning: warningMessage,
    trustRestriction,
  };
}

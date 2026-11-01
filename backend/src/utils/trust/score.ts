import { and, eq, gt, gte, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../../db";
import { trust_actions, trust_events } from "../../db/schema";
import { trustPolicyVersion, trustPolicyWeights, trustScoreWindowStart, trustSeriousKinds } from "./policy";

export async function readTrustMonitoringScore(subjectId?: string) {
  // Old violations fade out: only events and low ratings inside the window count.
  const windowStart = trustScoreWindowStart();
  const reviewSince = windowStart ? sql`and review.created_at >= ${windowStart.toISOString()}::timestamptz` : sql``;
  const [rows, ratingResult, feedbackResult] = await Promise.all([db.select({
    kind: trust_events.kind,
    classification: trust_events.classification,
    count: sql<number>`count(*)::int`,
  }).from(trust_events).where(and(
    subjectId ? eq(trust_events.subjectId, subjectId) : undefined,
    isNull(trust_events.invalidatedAt),
    windowStart ? gte(trust_events.createdAt, windowStart) : undefined,
  )).groupBy(trust_events.kind, trust_events.classification),
  db.execute(sql`
    select count(distinct order_id)::int as count from (
      select review.order_id from order_reviews as review
      inner join orders as purchase on purchase.id = review.order_id
      where purchase.status = 'completed' and review.rating <= 2 ${reviewSince}
        ${subjectId ? sql`and review.seller_id = ${subjectId}` : sql``}
      union
      select review.order_id from product_reviews as review
      inner join orders as purchase on purchase.id = review.order_id
      where purchase.status = 'completed' and review.rating <= 2 ${reviewSince}
        ${subjectId ? sql`and review.seller_id = ${subjectId}` : sql``}
    ) as low_ratings
  `),
  db.execute(sql`
    select (
      (select count(*) from order_reviews where length(btrim(coalesce(review, ''))) > 0
        ${subjectId ? sql`and seller_id = ${subjectId}` : sql``})
      + (select count(*) from product_reviews where length(btrim(coalesce(review, ''))) > 0
        ${subjectId ? sql`and seller_id = ${subjectId}` : sql``})
    )::int as count
  `)]);

  // A serious violation blocks the account once. After the person restores the account, only newer serious violations count.
  const [restored] = subjectId ? await db.select({ at: sql<Date | null>`max(${trust_actions.revokedAt})` }).from(trust_actions)
    .where(and(eq(trust_actions.subjectId, subjectId), eq(trust_actions.actionType, "blocked"))) : [];
  const seriousRows = restored?.at
    ? await db.select({ count: sql<number>`count(*)::int` }).from(trust_events).where(and(
      eq(trust_events.subjectId, subjectId!), eq(trust_events.classification, "verified"), isNull(trust_events.invalidatedAt),
      inArray(trust_events.kind, [...trustSeriousKinds]),
      gt(trust_events.createdAt, new Date(restored.at)),
    ))
    : null;

  const verified = rows.filter((row) => row.classification === "verified");
  const allegations = rows.filter((row) => row.classification === "allegation");
  const components = verified.map((row) => ({
    kind: row.kind,
    count: Number(row.count),
    weight: trustPolicyWeights[row.kind as keyof typeof trustPolicyWeights] ?? 0,
    points: Number(row.count) * (trustPolicyWeights[row.kind as keyof typeof trustPolicyWeights] ?? 0),
  }));
  const seriousViolations = seriousRows
    ? Number(seriousRows[0]?.count ?? 0)
    : verified.filter((row) => trustSeriousKinds.includes(row.kind)).reduce((total, row) => total + Number(row.count), 0);
  const ratingSignals = Number(ratingResult.rows[0]?.count ?? 0);
  const verifiedEventPoints = components.reduce((total, item) => total + item.points, 0);
  return {
    policyVersion: trustPolicyVersion,
    weightedPoints: verifiedEventPoints + ratingSignals * trustPolicyWeights.low_rating,
    verifiedEventPoints,
    seriousViolations,
    ratingSignals,
    writtenFeedbackCount: Number(feedbackResult.rows[0]?.count ?? 0),
    verifiedEvents: components.reduce((total, item) => total + item.count, 0),
    allegationFlags: allegations.reduce((total, item) => total + Number(item.count), 0),
    components: [...components, {
      kind: "low_rating",
      count: ratingSignals,
      weight: trustPolicyWeights.low_rating,
      points: ratingSignals * trustPolicyWeights.low_rating,
    }],
  };
}

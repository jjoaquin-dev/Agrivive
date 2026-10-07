import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../db";
import { trust_events } from "../../db/schema";

const monitorWeights: Record<string, number> = {
  inquiry_non_response: 1,
  seller_cancellation: 2,
};

export async function readTrustMonitoringScore(subjectId?: string) {
  const [rows, ratingResult, feedbackResult] = await Promise.all([db.select({
    kind: trust_events.kind,
    classification: trust_events.classification,
    count: sql<number>`count(*)::int`,
  }).from(trust_events).where(and(
    subjectId ? eq(trust_events.subjectId, subjectId) : undefined,
    isNull(trust_events.invalidatedAt),
  )).groupBy(trust_events.kind, trust_events.classification),
  db.execute(sql`
    select count(distinct order_id)::int as count from (
      select review.order_id from order_reviews as review
      inner join orders as purchase on purchase.id = review.order_id
      where purchase.status = 'completed' and review.rating <= 2
        ${subjectId ? sql`and review.seller_id = ${subjectId}` : sql``}
      union
      select review.order_id from product_reviews as review
      inner join orders as purchase on purchase.id = review.order_id
      where purchase.status = 'completed' and review.rating <= 2
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

  const verified = rows.filter((row) => row.classification === "verified");
  const allegations = rows.filter((row) => row.classification === "allegation");
  const components = verified.map((row) => ({
    kind: row.kind,
    count: Number(row.count),
    weight: monitorWeights[row.kind] ?? 0,
    points: Number(row.count) * (monitorWeights[row.kind] ?? 0),
  }));
  const ratingSignals = Number(ratingResult.rows[0]?.count ?? 0);
  const verifiedEventPoints = components.reduce((total, item) => total + item.points, 0);
  return {
    policyVersion: "monitoring-v2",
    weightedPoints: verifiedEventPoints + ratingSignals,
    verifiedEventPoints,
    ratingSignals,
    writtenFeedbackCount: Number(feedbackResult.rows[0]?.count ?? 0),
    verifiedEvents: components.reduce((total, item) => total + item.count, 0),
    allegationFlags: allegations.reduce((total, item) => total + Number(item.count), 0),
    components: [...components, { kind: "low_rating", count: ratingSignals, weight: 1, points: ratingSignals }],
  };
}

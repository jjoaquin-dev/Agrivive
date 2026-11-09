import { and, eq, gt, gte, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../../db";
import { order_reviews, trust_actions, trust_events } from "../../db/schema";
import { trustPolicyVersion, trustPolicyWeights, trustScoreWindowStart, trustSeriousKinds } from "./policy";

const kindWeight = (kind: string) => trustPolicyWeights[kind as keyof typeof trustPolicyWeights] ?? 0;

/** Equation 1: S = sum of the weights of the verified events in the last 90 days. Excused and overturned events (invalidated) never count. */
export async function readTrustMonitoringScore(subjectId?: string, now = new Date()) {
  const windowStart = trustScoreWindowStart(now);
  const rows = await db.select({
    kind: trust_events.kind,
    classification: trust_events.classification,
    count: sql<number>`count(*)::int`,
    stored: sql<number>`coalesce(sum(${trust_events.weight}), 0)::int`,
    withWeight: sql<number>`count(${trust_events.weight})::int`,
  }).from(trust_events).where(and(
    subjectId ? eq(trust_events.subjectId, subjectId) : undefined,
    isNull(trust_events.invalidatedAt),
    windowStart ? gte(trust_events.createdAt, windowStart) : undefined,
  )).groupBy(trust_events.kind, trust_events.classification);

  const feedback = await db.execute(sql`
    select count(*)::int as count from ${order_reviews} where ignored_at is null and length(btrim(coalesce(review, ''))) > 0 ${subjectId ? sql`and seller_id = ${subjectId}` : sql``}`);

  // A serious violation blocks the account once. After the person restores the account, only newer serious violations count.
  const [restored] = subjectId ? await db.select({ at: sql<Date | null>`max(${trust_actions.revokedAt})` }).from(trust_actions)
    .where(and(eq(trust_actions.subjectId, subjectId), eq(trust_actions.actionType, "blocked"))) : [];
  const seriousRows = restored?.at
    ? await db.select({ count: sql<number>`count(*)::int` }).from(trust_events).where(and(
      eq(trust_events.subjectId, subjectId!), eq(trust_events.classification, "verified"), isNull(trust_events.invalidatedAt),
      inArray(trust_events.kind, [...trustSeriousKinds]), gt(trust_events.createdAt, new Date(restored.at))))
    : null;

  const verified = rows.filter((row) => row.classification === "verified");
  const allegations = rows.filter((row) => row.classification === "allegation");
  const components = verified.map((row) => {
    const points = Number(row.stored) + (Number(row.count) - Number(row.withWeight)) * kindWeight(row.kind);
    return { kind: row.kind, count: Number(row.count), weight: kindWeight(row.kind), points };
  });
  const seriousViolations = seriousRows
    ? Number(seriousRows[0]?.count ?? 0)
    : verified.filter((row) => trustSeriousKinds.includes(row.kind)).reduce((total, row) => total + Number(row.count), 0);
  const ratingSignals = components.find((item) => item.kind === "low_rating")?.count ?? 0;
  const verifiedEventPoints = components.reduce((total, item) => total + item.points, 0);
  return {
    policyVersion: trustPolicyVersion,
    weightedPoints: verifiedEventPoints,
    verifiedEventPoints,
    seriousViolations,
    ratingSignals,
    writtenFeedbackCount: Number(feedback.rows[0]?.count ?? 0),
    verifiedEvents: components.reduce((total, item) => total + item.count, 0),
    allegationFlags: allegations.reduce((total, item) => total + Number(item.count), 0),
    components,
  };
}

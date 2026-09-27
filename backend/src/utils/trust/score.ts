import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../db";
import { trust_events } from "../../db/schema";

const monitorWeights: Record<string, number> = {
  inquiry_non_response: 1,
  seller_cancellation: 2,
};

export async function readTrustMonitoringScore(subjectId?: string) {
  const rows = await db.select({
    kind: trust_events.kind,
    classification: trust_events.classification,
    count: sql<number>`count(*)::int`,
  }).from(trust_events).where(and(
    subjectId ? eq(trust_events.subjectId, subjectId) : undefined,
    isNull(trust_events.invalidatedAt),
  )).groupBy(trust_events.kind, trust_events.classification);

  const verified = rows.filter((row) => row.classification === "verified");
  const allegations = rows.filter((row) => row.classification === "allegation");
  const components = verified.map((row) => ({
    kind: row.kind,
    count: Number(row.count),
    weight: monitorWeights[row.kind] ?? 0,
    points: Number(row.count) * (monitorWeights[row.kind] ?? 0),
  }));
  return {
    policyVersion: "monitoring-v1",
    weightedPoints: components.reduce((total, item) => total + item.points, 0),
    verifiedEvents: components.reduce((total, item) => total + item.count, 0),
    allegationFlags: allegations.reduce((total, item) => total + Number(item.count), 0),
    components,
  };
}

import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { trust_actions, trust_events, trust_notices } from "../../../db/schema";
import { readTrustMonitoringScore } from "../../../utils/trust/score";

export async function listSellerTrustEvents(sellerId: string) {
  const [events, notices, actions] = await Promise.all([
    db.select({ id: trust_events.id, orderId: trust_events.orderId,
      kind: trust_events.kind, policyVersion: trust_events.policyVersion,
      createdAt: trust_events.createdAt,
    }).from(trust_events).where(and(
      eq(trust_events.subjectId, sellerId), eq(trust_events.classification, "verified"),
      isNull(trust_events.invalidatedAt),
    )).orderBy(desc(trust_events.createdAt)).limit(100),
    db.select({ id: trust_notices.id, orderId: trust_notices.orderId,
      kind: trust_notices.kind, createdAt: trust_notices.createdAt,
      sentAt: trust_notices.sentAt,
    }).from(trust_notices).where(eq(trust_notices.recipientId, sellerId))
      .orderBy(desc(trust_notices.createdAt)).limit(100),
    db.select({ id: trust_actions.id, actionType: trust_actions.actionType,
      weightedPoints: trust_actions.weightedPoints, policyVersion: trust_actions.policyVersion,
      reason: trust_actions.reason, startsAt: trust_actions.startsAt,
      endsAt: trust_actions.endsAt, revokedAt: trust_actions.revokedAt,
    }).from(trust_actions).where(eq(trust_actions.subjectId, sellerId))
      .orderBy(desc(trust_actions.createdAt)).limit(100),
  ]);
  const monitoring = await readTrustMonitoringScore(sellerId);
  return { events, notices, actions, monitoring };
}

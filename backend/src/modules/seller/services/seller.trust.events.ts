import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { trust_events, trust_notices } from "../../../db/schema";

export async function listSellerTrustEvents(sellerId: string) {
  const [events, notices] = await Promise.all([
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
  ]);
  return { events, notices };
}

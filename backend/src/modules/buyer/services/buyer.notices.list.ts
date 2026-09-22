import { desc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { trust_notices } from "../../../db/schema";

export function listBuyerNotices(buyerId: string) {
  return db.select({ id: trust_notices.id, orderId: trust_notices.orderId,
    kind: trust_notices.kind, createdAt: trust_notices.createdAt, sentAt: trust_notices.sentAt,
  }).from(trust_notices).where(eq(trust_notices.recipientId, buyerId))
    .orderBy(desc(trust_notices.createdAt)).limit(100);
}

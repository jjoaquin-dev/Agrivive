import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { trust_notices } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

export async function readBuyerNotice(buyerId: string, noticeId: string) {
  return db.transaction(async (tx) => {
    const [notice] = await tx.select({
      id: trust_notices.id,
      orderId: trust_notices.orderId,
      kind: trust_notices.kind,
      createdAt: trust_notices.createdAt,
      readAt: trust_notices.readAt,
    }).from(trust_notices).where(and(
      eq(trust_notices.id, noticeId),
      eq(trust_notices.recipientId, buyerId),
    )).for("update").limit(1);

    if (!notice) throw new OrderError(404, "Notice not found");
    if (notice.readAt) return notice;

    const [updated] = await tx.update(trust_notices).set({ readAt: new Date() })
      .where(eq(trust_notices.id, noticeId)).returning({
        id: trust_notices.id,
        orderId: trust_notices.orderId,
        kind: trust_notices.kind,
        createdAt: trust_notices.createdAt,
        readAt: trust_notices.readAt,
      });
    return updated ?? notice;
  });
}

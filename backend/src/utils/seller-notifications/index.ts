import { sql } from "drizzle-orm";
import { seller_notifications, user } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { enqueueSellerAlert } from "./enqueue";
import { sellerOrderCode, type SellerNoticeKind, type SellerNoticePayload } from "./messages";

export { sellerMessageChannel } from "./enqueue";

/**
 * Stores one seller notification and queues its phone alert.
 * Safe to call twice with the same dedupeKey: the second call does nothing.
 */
export async function createSellerNotification(tx: OrderTransaction, input: {
  sellerId: string;
  kind: SellerNoticeKind;
  dedupeKey: string;
  orderId?: string | null;
  productId?: string | null;
  payload?: SellerNoticePayload;
}) {
  const payload = {
    ...(input.orderId ? { code: sellerOrderCode(input.orderId) } : {}),
    ...input.payload,
  };
  const [row] = await tx.insert(seller_notifications).values({
    sellerId: input.sellerId,
    kind: input.kind,
    orderId: input.orderId ?? null,
    productId: input.productId ?? null,
    payload,
    dedupeKey: input.dedupeKey,
  }).onConflictDoNothing({ target: seller_notifications.dedupeKey }).returning();
  if (!row) return null;

  await enqueueSellerAlert(tx, {
    sellerId: input.sellerId,
    kind: input.kind,
    orderId: input.orderId,
    payload,
    createdAt: row.createdAt,
  });
  return row;
}

/** Phone alert for a trust notice. Trust notices also go to buyers, so only sellers get this. */
export async function alertSellerOfTrustNotice(tx: OrderTransaction, notice: {
  recipientId: string;
  orderId?: string | null;
  kind: string;
}) {
  const [recipient] = await tx.select({ id: user.id }).from(user)
    .where(sql`${user.id} = ${notice.recipientId} and 'seller'::"role" = any(${user.role})`)
    .limit(1);
  if (!recipient) return;
  await enqueueSellerAlert(tx, {
    sellerId: notice.recipientId,
    kind: notice.kind,
    orderId: notice.orderId,
    payload: notice.orderId ? { code: sellerOrderCode(notice.orderId) } : {},
  });
}

import { trust_notices } from "../../db/schema";
import type { OrderTransaction } from "../order-types";

export type BuyerReplyKind = "seller_inquiry_reply" | "seller_review_reply" | "seller_chat_reply";

/** Tells a buyer in the bell that a seller answered. Push and email are skipped: sentAt is set so the email job ignores it. */
export async function queueBuyerReplyNotice(tx: OrderTransaction, input: {
  noticeKey: string;
  buyerId: string;
  orderId?: string | null;
  kind: BuyerReplyKind;
}) {
  await tx.insert(trust_notices).values({
    noticeKey: input.noticeKey, recipientId: input.buyerId,
    orderId: input.orderId ?? null, kind: input.kind, sentAt: new Date(),
  }).onConflictDoNothing({ target: trust_notices.noticeKey });
}

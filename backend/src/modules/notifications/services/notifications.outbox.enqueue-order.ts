import { notification_outbox } from "../../../db/schema";

type TransactionLike = {
  insert: (table: typeof notification_outbox) => any;
};

export async function enqueueOrderNotification(
  tx: TransactionLike,
  sellerId: string,
  orderId: string,
  summary: string,
  createdAt: Date = new Date(),
) {
  const dedupeKey = `${sellerId}:order:${orderId}`;

  await tx.insert(notification_outbox).values({
    recipientUserId: sellerId,
    type: "seller_message",
    aggregationKey: `seller_order:${sellerId}`,
    dedupeKey,
    referenceId: orderId,
    itemCount: 1,
    payload: { orderId, summary },
    availableAt: createdAt,
    createdAt,
    updatedAt: createdAt,
  }).onConflictDoNothing({ target: notification_outbox.dedupeKey });
}

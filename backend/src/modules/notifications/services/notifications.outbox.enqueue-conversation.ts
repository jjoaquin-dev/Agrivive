import { sql } from "drizzle-orm";
import { notification_outbox } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";
import { sellerMessageChannel } from "../../../utils/seller-notifications";

const aggregationWindowMs = () => {
  const seconds = Number(process.env.PUSH_MESSAGE_WINDOW_SECONDS ?? 60);
  return Math.max(10, Math.min(seconds, 3600)) * 1000;
};

export async function enqueueConversationNotification(
  tx: OrderTransaction,
  recipientUserId: string,
  conversationId: string,
  type: "seller_message" | "buyer_message",
  createdAt: Date,
) {
  const windowMs = aggregationWindowMs();
  const windowStart = new Date(Math.floor(createdAt.getTime() / windowMs) * windowMs);
  const dedupeKey = `${recipientUserId}:${type}:${windowStart.toISOString()}`;
  const availableAt = new Date(createdAt.getTime() + windowMs);
  const channel = type === "seller_message" ? await sellerMessageChannel(tx, recipientUserId) : undefined;

  await tx.insert(notification_outbox).values({
    recipientUserId,
    type,
    aggregationKey: `${type}:${recipientUserId}`,
    dedupeKey,
    referenceId: conversationId,
    itemCount: 1,
    payload: { conversationId, type, ...(channel ? { channel } : {}) },
    availableAt,
    createdAt,
    updatedAt: createdAt,
  }).onConflictDoUpdate({
    target: notification_outbox.dedupeKey,
    set: {
      itemCount: sql`${notification_outbox.itemCount} + 1`,
      referenceId: conversationId,
      availableAt,
      updatedAt: createdAt,
    },
  });
}

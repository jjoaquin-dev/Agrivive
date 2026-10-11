import { and, eq, isNull, or } from "drizzle-orm";
import { db } from "../../../db";
import {
  conversation_messages,
  conversation_participants,
  conversations,
  order_inquiries,
  product_inquiries,
} from "../../../db/schema";
import type { SendConversationMessageBody } from "../model/conversation";
import { ConversationError } from "./conversation.error";
import { publishConversationMessage } from "./conversation.realtime";
import { enqueueConversationNotification } from "../../notifications/services/notifications.outbox.enqueue-conversation";

export async function createConversationMessage(userId: string, conversationId: string, input: SendConversationMessageBody) {
  const body = input.message.trim();
  if (!body) throw new ConversationError(400, "Message is required");

  const result = await db.transaction(async (tx) => {
    const [conversation] = await tx.select().from(conversations).where(and(
      eq(conversations.id, conversationId),
      or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId)),
    )).limit(1).for("update");
    if (!conversation) throw new ConversationError(404, "Conversation not found");
    if (conversation.status === "closed") throw new ConversationError(409, "Conversation is closed");

    const [duplicate] = await tx.select().from(conversation_messages).where(and(
      eq(conversation_messages.conversationId, conversationId),
      eq(conversation_messages.clientMessageId, input.clientMessageId),
    )).limit(1);
    if (duplicate) return { conversation, message: duplicate, duplicate: true };

    const now = new Date();
    const [message] = await tx.insert(conversation_messages).values({
      conversationId,
      senderId: userId,
      clientMessageId: input.clientMessageId,
      body,
      createdAt: now,
    }).returning();
    await tx.update(conversations).set({ lastMessageAt: now, updatedAt: now }).where(eq(conversations.id, conversationId));
    await tx.update(conversation_participants).set({ lastReadAt: now }).where(and(
      eq(conversation_participants.conversationId, conversationId),
      eq(conversation_participants.userId, userId),
    ));

    const recipientUserId = userId === conversation.sellerId
      ? conversation.buyerId
      : conversation.sellerId;
    const notificationType = userId === conversation.sellerId
      ? "buyer_message"
      : "seller_message";
    await enqueueConversationNotification(
      tx,
      recipientUserId,
      conversationId,
      notificationType,
      now,
    );

    if (userId === conversation.sellerId) {
      if (conversation.contextType === "order" && conversation.orderId) {
        await tx.update(order_inquiries).set({ reply: body, repliedAt: now }).where(and(
          eq(order_inquiries.orderId, conversation.orderId),
          eq(order_inquiries.sellerId, userId),
          isNull(order_inquiries.repliedAt),
        ));
      }
      if (conversation.contextType === "product" && conversation.productId) {
        await tx.update(product_inquiries).set({ reply: body, repliedAt: now }).where(and(
          eq(product_inquiries.productId, conversation.productId),
          eq(product_inquiries.buyerId, conversation.buyerId),
          eq(product_inquiries.sellerId, userId),
          isNull(product_inquiries.repliedAt),
        ));
      }
    }
    return { conversation, message, duplicate: false };
  });

  if (!result.duplicate) publishConversationMessage(conversationId, result.message);
  return result.message;
}

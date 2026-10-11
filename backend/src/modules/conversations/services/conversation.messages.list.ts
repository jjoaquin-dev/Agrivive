import { and, asc, eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { conversation_messages, conversations } from "../../../db/schema";
import { ConversationError } from "./conversation.error";

export async function listConversationMessages(userId: string, conversationId: string) {
  const [conversation] = await db.select({ id: conversations.id }).from(conversations).where(and(
    eq(conversations.id, conversationId),
    or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId)),
  )).limit(1);
  if (!conversation) throw new ConversationError(404, "Conversation not found");

  return db.select({
    id: conversation_messages.id,
    conversationId: conversation_messages.conversationId,
    senderId: conversation_messages.senderId,
    clientMessageId: conversation_messages.clientMessageId,
    body: conversation_messages.body,
    createdAt: conversation_messages.createdAt,
  }).from(conversation_messages)
    .where(eq(conversation_messages.conversationId, conversationId))
    .orderBy(asc(conversation_messages.createdAt), asc(conversation_messages.id));
}

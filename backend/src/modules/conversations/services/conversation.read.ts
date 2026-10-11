import { and, eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { conversation_participants, conversations } from "../../../db/schema";
import { ConversationError } from "./conversation.error";

export async function markConversationRead(userId: string, conversationId: string) {
  const [conversation] = await db.select({ id: conversations.id }).from(conversations).where(and(
    eq(conversations.id, conversationId),
    or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId)),
  )).limit(1);
  if (!conversation) throw new ConversationError(404, "Conversation not found");
  const [participant] = await db.update(conversation_participants).set({ lastReadAt: new Date() }).where(and(
    eq(conversation_participants.conversationId, conversationId),
    eq(conversation_participants.userId, userId),
  )).returning();
  return participant;
}

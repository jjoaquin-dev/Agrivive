import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../../db";
import { conversation_participants, conversations } from "../../../db/schema";
import { conversationSideFilter, type ConversationSide } from "./conversation.scope";

export async function markAllConversationsRead(userId: string, side?: ConversationSide) {
  const userConvos = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(conversationSideFilter(userId, side));

  if (userConvos.length === 0) return { updatedCount: 0 };

  const ids = userConvos.map((c) => c.id);
  const updated = await db
    .update(conversation_participants)
    .set({ lastReadAt: new Date() })
    .where(and(
      inArray(conversation_participants.conversationId, ids),
      eq(conversation_participants.userId, userId),
    ))
    .returning({ id: conversation_participants.id });

  return { updatedCount: updated.length };
}

import { and, eq, gt, ne, sql } from "drizzle-orm";
import { db } from "../../../db";
import { conversation_messages, conversation_participants, conversations } from "../../../db/schema";
import { conversationSideFilter, type ConversationSide } from "./conversation.scope";

/** All unread messages sent by the other person, in one query (no paging). */
export async function getConversationUnreadCount(userId: string, side?: ConversationSide) {
  const [row] = await db.select({
    unreadMessages: sql<number>`count(*)::int`,
    unreadConversations: sql<number>`count(distinct ${conversation_messages.conversationId})::int`,
  }).from(conversation_messages)
    .innerJoin(conversations, eq(conversations.id, conversation_messages.conversationId))
    .innerJoin(conversation_participants, and(
      eq(conversation_participants.conversationId, conversation_messages.conversationId),
      eq(conversation_participants.userId, userId),
    ))
    .where(and(
      conversationSideFilter(userId, side),
      ne(conversation_messages.senderId, userId),
      gt(conversation_messages.createdAt, sql`coalesce(${conversation_participants.lastReadAt}, 'epoch'::timestamptz)`),
    ));
  return { unreadMessages: row?.unreadMessages ?? 0, unreadConversations: row?.unreadConversations ?? 0 };
}

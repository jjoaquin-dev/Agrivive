import { and, eq, gt, ne, sql } from "drizzle-orm";
import { db } from "../../../db";
import { conversation_messages, conversation_participants } from "../../../db/schema";

/** All unread messages sent by the other person, in one query (no paging). */
export async function getConversationUnreadCount(userId: string) {
  const [row] = await db.select({
    unreadMessages: sql<number>`count(*)::int`,
    unreadConversations: sql<number>`count(distinct ${conversation_messages.conversationId})::int`,
  }).from(conversation_messages)
    .innerJoin(conversation_participants, and(
      eq(conversation_participants.conversationId, conversation_messages.conversationId),
      eq(conversation_participants.userId, userId),
    ))
    .where(and(
      ne(conversation_messages.senderId, userId),
      gt(conversation_messages.createdAt, sql`coalesce(${conversation_participants.lastReadAt}, 'epoch'::timestamptz)`),
    ));
  return { unreadMessages: row?.unreadMessages ?? 0, unreadConversations: row?.unreadConversations ?? 0 };
}

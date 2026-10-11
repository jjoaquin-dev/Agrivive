import { and, desc, eq, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import {
  conversation_messages,
  conversation_participants,
  conversations,
  sellers_product,
  sellers_profile,
  user,
} from "../../../db/schema";

export async function listConversations(userId: string, limit = 50) {
  return db.select({
    id: conversations.id,
    contextType: conversations.contextType,
    productId: conversations.productId,
    orderId: conversations.orderId,
    buyerId: conversations.buyerId,
    sellerId: conversations.sellerId,
    status: conversations.status,
    lastMessageAt: conversations.lastMessageAt,
    createdAt: conversations.createdAt,
    productName: sellers_product.productName,
    productImageUrl: sellers_product.imagUrl,
    sellerName: user.name,
    sellerImage: user.image,
    sellerShopName: sellers_profile.shopName,
    lastMessageBody: sql<string | null>`(
      select latest_message.body
      from conversation_messages as latest_message
      where latest_message.conversation_id = ${conversations.id}
      order by latest_message.created_at desc, latest_message.id desc
      limit 1
    )`,
    unreadCount: sql<number>`(
      select count(*)::int from conversation_messages as unread_message
      where unread_message.conversation_id = ${conversations.id}
        and unread_message.sender_id <> ${userId}
        and unread_message.created_at > coalesce(${conversation_participants.lastReadAt}, 'epoch'::timestamptz)
    )`,
  }).from(conversations)
    .innerJoin(conversation_participants, and(
      eq(conversation_participants.conversationId, conversations.id),
      eq(conversation_participants.userId, userId),
    ))
    .innerJoin(user, eq(user.id, conversations.sellerId))
    .leftJoin(sellers_profile, and(
      eq(sellers_profile.userId, conversations.sellerId),
      eq(sellers_profile.isCurrent, true),
    ))
    .leftJoin(sellers_product, eq(sellers_product.id, conversations.productId))
    .where(or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId)))
    .orderBy(desc(conversations.lastMessageAt), desc(conversations.id))
    .limit(limit);
}

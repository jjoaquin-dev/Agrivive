import { aliasedTable, and, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import {
  conversation_participants,
  conversations,
  sellers_product,
  sellers_profile,
  user,
} from "../../../db/schema";

/** The shared select and joins for one conversation row, as the signed-in user sees it. Callers add where, order and limit. */
export function buildConversationSelect(userId: string) {
  const buyerUser = aliasedTable(user, "buyer_user");
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
    productName: sql<string | null>`coalesce(
      ${sellers_product.productName},
      (
        select oi.product_name
        from ordered_items as oi
        where oi.orders_id = ${conversations.orderId}
        order by oi.created_at asc
        limit 1
      )
    )`,
    productImageUrl: sql<string | null>`coalesce(
      ${sellers_product.imagUrl},
      (
        select p_oi.image_url
        from ordered_items as oi
        join sellers_product as p_oi on p_oi.id = oi.product_id
        where oi.orders_id = ${conversations.orderId}
        order by oi.created_at asc
        limit 1
      )
    )`,
    productPrice: sellers_product.productPrice,
    scalingType: sellers_product.scalingType,
    productQty: sellers_product.productQty,
    sellerName: user.name,
    sellerImage: user.image,
    sellerShopName: sellers_profile.shopName,
    buyerName: buyerUser.name,
    buyerImage: buyerUser.image,
    lastMessageBody: sql<string | null>`(
      select latest_message.body
      from conversation_messages as latest_message
      where latest_message.conversation_id = ${conversations.id}
      order by latest_message.created_at desc, latest_message.id desc
      limit 1
    )`,
    lastMessageSenderId: sql<string | null>`(
      select latest_message.sender_id
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
    .innerJoin(buyerUser, eq(buyerUser.id, conversations.buyerId))
    .leftJoin(sellers_profile, and(
      eq(sellers_profile.userId, conversations.sellerId),
      eq(sellers_profile.isCurrent, true),
    ))
    .leftJoin(sellers_product, eq(sellers_product.id, conversations.productId));
}

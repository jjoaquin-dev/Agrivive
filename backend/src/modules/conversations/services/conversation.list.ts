import { aliasedTable, and, desc, eq, lt, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import {
  conversation_messages,
  conversation_participants,
  conversations,
  sellers_product,
  sellers_profile,
  user,
} from "../../../db/schema";
import { getAvatarDisplayUrl } from "../../../utils/s3-avatar";

export async function listConversations(userId: string, limit = 50, cursor?: string) {
  const buyerUser = aliasedTable(user, "buyer_user");

  let before;
  if (cursor) {
    const [anchor] = await db
      .select({ id: conversations.id, lastMessageAt: conversations.lastMessageAt })
      .from(conversations)
      .where(and(eq(conversations.id, cursor), or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId))))
      .limit(1);
    if (anchor) {
      before = or(
        lt(conversations.lastMessageAt, anchor.lastMessageAt),
        and(eq(conversations.lastMessageAt, anchor.lastMessageAt), lt(conversations.id, anchor.id)),
      );
    }
  }

  const rows = await db.select({
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
    .leftJoin(sellers_product, eq(sellers_product.id, conversations.productId))
    .where(and(or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId)), before))
    .orderBy(desc(conversations.lastMessageAt), desc(conversations.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;

  const items = await Promise.all(
    page.map(async (row) => ({
      ...row,
      sellerImage: await getAvatarDisplayUrl(row.sellerImage),
      buyerImage: await getAvatarDisplayUrl(row.buyerImage),
    })),
  );

  return {
    items,
    nextCursor: hasMore && page.length > 0 ? page[page.length - 1].id : null,
  };
}

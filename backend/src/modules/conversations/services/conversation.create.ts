import { and, desc, eq, gt, isNotNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import {
  conversation_messages,
  conversation_participants,
  conversations,
  order_inquiries,
  orders,
  product_inquiries,
  sellers_product,
  sellers_profile,
  user,
} from "../../../db/schema";
import { requireActiveUser } from "../../../utils/order-access";
import { ConversationError } from "./conversation.error";
import type { CreateConversationBody } from "../model/conversation";

export async function createConversation(buyerId: string, input: CreateConversationBody) {
  const body = input.message.trim();
  if (!body) throw new ConversationError(400, "Message is required");
  if (input.contextType === "product" && !input.productId) throw new ConversationError(400, "Product is required");
  if (input.contextType === "order" && !input.orderId) throw new ConversationError(400, "Order is required");
  if (input.contextType === "seller" && !input.sellerId) throw new ConversationError(400, "Seller is required");

  return db.transaction(async (tx) => {
    await requireActiveUser(tx, buyerId, "buyer");
    let sellerId: string;

    if (input.contextType === "product") {
      const [product] = await tx.select({ id: sellers_product.id, sellerId: sellers_product.userId })
        .from(sellers_product)
        .innerJoin(user, eq(user.id, sellers_product.userId))
        .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
        .where(and(
          eq(sellers_product.id, input.productId!),
          eq(sellers_product.isActive, true),
          eq(sellers_product.isMarketable, true),
          gt(sellers_product.productQty, "0"),
          eq(user.isActive, true),
          eq(user.emailVerified, true),
          sql`'seller' = ANY(coalesce(${user.role}, ARRAY[]::"role"[]))`,
          eq(sellers_profile.isCurrent, true),
          isNotNull(sellers_profile.latitude),
          isNotNull(sellers_profile.longitude),
        )).limit(1);
      if (!product) throw new ConversationError(404, "Marketplace product not found");
      sellerId = product.sellerId;
    } else if (input.contextType === "order") {
      const [order] = await tx.select({
        id: orders.id,
        sellerId: orders.sellersId,
        status: orders.status,
        expiresAt: orders.expiresAt,
      })
        .from(orders).where(and(eq(orders.id, input.orderId!), eq(orders.buyersId, buyerId))).limit(1);
      if (!order) throw new ConversationError(404, "Order not found");
      if (order.status !== "pending" || !order.expiresAt || order.expiresAt <= new Date()) {
        throw new ConversationError(409, "Only active orders accept new messages");
      }
      sellerId = order.sellerId;
    } else {
      const [seller] = await tx.select({ id: user.id })
        .from(user)
        .innerJoin(sellers_profile, eq(sellers_profile.userId, user.id))
        .where(and(
          eq(user.id, input.sellerId!),
          eq(user.isActive, true),
          eq(user.emailVerified, true),
          sql`'seller' = ANY(coalesce(${user.role}, ARRAY[]::"role"[]))`,
          eq(sellers_profile.isCurrent, true),
          isNotNull(sellers_profile.latitude),
          isNotNull(sellers_profile.longitude),
        )).limit(1);
      if (!seller) throw new ConversationError(404, "Seller not found");
      sellerId = seller.id;
    }

    if (input.contextType === "product") {
      await tx.insert(product_inquiries).values({
        productId: input.productId!, buyerId, sellerId, question: body,
      }).onConflictDoNothing();
    } else if (input.contextType === "order") {
      await tx.insert(order_inquiries).values({
        orderId: input.orderId!, buyerId, sellerId, question: body,
      }).onConflictDoNothing();
    }

    const now = new Date();

    // Check if a conversation between these two accounts already exists
    const [existing] = await tx.select().from(conversations)
      .where(and(
        eq(conversations.buyerId, buyerId),
        eq(conversations.sellerId, sellerId),
      ))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(1);

    let activeConversation = existing;

    if (existing) {
      // Re-use the existing conversation thread, updating context to the latest product/order
      const [updated] = await tx.update(conversations).set({
        contextType: input.contextType,
        productId: input.productId ?? existing.productId,
        orderId: input.orderId ?? existing.orderId,
        lastMessageAt: now,
        status: "open",
        updatedAt: now,
      }).where(eq(conversations.id, existing.id)).returning();
      activeConversation = updated;
    } else {
      // Create one unified conversation for this account pair
      const [created] = await tx.insert(conversations).values({
        contextType: input.contextType,
        contextKey: `direct:${buyerId}:${sellerId}`,
        buyerId,
        sellerId,
        productId: input.productId,
        orderId: input.orderId,
        lastMessageAt: now,
      }).returning();
      activeConversation = created;

      await tx.insert(conversation_participants).values([
        { conversationId: activeConversation.id, userId: buyerId },
        { conversationId: activeConversation.id, userId: sellerId },
      ]);
    }

    const [message] = await tx.insert(conversation_messages).values({
      conversationId: activeConversation.id,
      senderId: buyerId,
      clientMessageId: input.clientMessageId,
      body,
      createdAt: now,
    }).returning();

    await tx.update(conversation_participants).set({ lastReadAt: now }).where(and(
      eq(conversation_participants.conversationId, activeConversation.id),
      eq(conversation_participants.userId, buyerId),
    ));

    return { conversation: activeConversation, message };
  });
}

import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { conversation_messages, conversation_participants, product_inquiries, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { findOrCreateDirectConversation } from "../../conversations/services/conversation.direct.find-or-create";
import { publishConversationMessage } from "../../conversations/services/conversation.realtime";
import { enqueueConversationNotification } from "../../notifications/services/notifications.outbox.enqueue-conversation";

const maxQuestionLength = 200;

export async function replySellerProductInquiry(sellerId: string, inquiryId: string, reply: string) {
  const text = reply.trim();
  if (!text) throw new OrderError(400, "Reply is required");

  const result = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [inquiry] = await tx.select().from(product_inquiries).where(and(
      eq(product_inquiries.id, inquiryId), eq(product_inquiries.sellerId, sellerId),
    )).for("update").limit(1);
    if (!inquiry) throw new OrderError(404, "Product inquiry not found");
    if (inquiry.repliedAt) throw new OrderError(409, "Product inquiry already answered");
    const now = new Date();
    const [updated] = await tx.update(product_inquiries).set({ reply: text, repliedAt: now })
      .where(and(
        eq(product_inquiries.id, inquiryId),
        eq(product_inquiries.sellerId, sellerId),
        isNull(product_inquiries.repliedAt),
      )).returning();
    if (!updated) throw new OrderError(404, "Open product inquiry not found");

    const [product] = await tx.select({ name: sellers_product.productName }).from(sellers_product)
      .where(eq(sellers_product.id, inquiry.productId)).limit(1);
    const conversation = await findOrCreateDirectConversation(tx, {
      buyerId: inquiry.buyerId, sellerId, contextType: "product", productId: inquiry.productId,
    });

    const clientMessageId = `inquiry-answer:${inquiry.id}`;
    const [duplicate] = await tx.select({ id: conversation_messages.id }).from(conversation_messages).where(and(
      eq(conversation_messages.conversationId, conversation.id),
      eq(conversation_messages.clientMessageId, clientMessageId),
    )).limit(1);

    let message;
    if (!duplicate) {
      const question = inquiry.question.length > maxQuestionLength
        ? `${inquiry.question.slice(0, maxQuestionLength)}…`
        : inquiry.question;
      [message] = await tx.insert(conversation_messages).values({
        conversationId: conversation.id,
        senderId: sellerId,
        clientMessageId,
        body: `About your question on ${product?.name ?? "your product"}: "${question}"\n\n${text}`,
        createdAt: now,
      }).returning();
      await tx.update(conversation_participants).set({ lastReadAt: now }).where(and(
        eq(conversation_participants.conversationId, conversation.id),
        eq(conversation_participants.userId, sellerId),
      ));
      await enqueueConversationNotification(tx, inquiry.buyerId, conversation.id, "buyer_message", now);
    }
    return { inquiry: updated, conversationId: conversation.id, message };
  });

  if (result.message) publishConversationMessage(result.conversationId, result.message);
  return { ...result.inquiry, conversationId: result.conversationId };
}

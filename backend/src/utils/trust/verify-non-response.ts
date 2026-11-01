import { and, eq, gt, min } from "drizzle-orm";
import { conversation_messages, conversations, order_inquiries, product_inquiries, type trust_events } from "../../db/schema";
import type { OrderTransaction } from "../order-types";

const FORTY_EIGHT_HOURS = 48 * 3_600_000;

const answeredLate = (since: Date, repliedAt: Date | null) => !repliedAt || repliedAt.getTime() - since.getTime() >= FORTY_EIGHT_HOURS;

/**
 * Re-checks a non-response violation against its source when the seller asks for a correction.
 * The source can be an order question, a product question, or a direct chat that waited for a reply.
 */
export async function isUnansweredTooLong(tx: OrderTransaction, event: typeof trust_events.$inferSelect): Promise<boolean> {
  if (!event.sourceId) return false;

  const [orderQuestion] = await tx.select().from(order_inquiries).where(eq(order_inquiries.id, event.sourceId)).limit(1);
  if (orderQuestion) return orderQuestion.orderId === event.orderId && answeredLate(orderQuestion.createdAt, orderQuestion.repliedAt);

  const [productQuestion] = await tx.select().from(product_inquiries).where(eq(product_inquiries.id, event.sourceId)).limit(1);
  if (productQuestion) return answeredLate(productQuestion.createdAt, productQuestion.repliedAt);

  const [chat] = await tx.select().from(conversations).where(eq(conversations.id, event.sourceId)).limit(1);
  const waitStartedAt = Number(/-(\d+)$/.exec(event.eventKey)?.[1]);
  if (!chat || !Number.isFinite(waitStartedAt)) return false;
  const since = new Date(waitStartedAt);
  const [reply] = await tx.select({ at: min(conversation_messages.createdAt) }).from(conversation_messages).where(and(
    eq(conversation_messages.conversationId, chat.id),
    eq(conversation_messages.senderId, chat.sellerId),
    gt(conversation_messages.createdAt, since),
  ));
  return answeredLate(since, reply?.at ?? null);
}

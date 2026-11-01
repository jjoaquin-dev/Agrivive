import { and, eq, exists, isNotNull, isNull, lte, notExists, or } from "drizzle-orm";
import { db } from "../../db";
import { conversation_participants, conversations, order_inquiries, product_inquiries, user } from "../../db/schema";
import { evaluateTrustAction } from "./evaluate-action";
import { recordReplyDeadlines } from "./response-deadlines";

const hoursAgo = (now: Date, hours: number) => new Date(now.getTime() - hours * 3_600_000);

/**
 * A buyer message that is not a product or order question has no inquiry row, so the conversation itself
 * remembers when it started waiting. If the same buyer also has an open question, that question's timer
 * already covers the wait, so the chat is skipped to avoid counting one ignored buyer twice.
 */
export async function processChatDeadlines(now: Date, limit: number) {
  const dueCondition = or(
    and(eq(conversations.deadlineStage, 0), lte(conversations.awaitingReplySince, hoursAgo(now, 12))),
    and(eq(conversations.deadlineStage, 1), lte(conversations.awaitingReplySince, hoursAgo(now, 24))),
    and(eq(conversations.deadlineStage, 2), lte(conversations.awaitingReplySince, hoursAgo(now, 48))),
  );
  const eligible = and(
    eq(conversations.status, "open"),
    isNotNull(conversations.awaitingReplySince),
    dueCondition,
    notExists(db.select({ id: conversation_participants.id }).from(conversation_participants).where(and(
      eq(conversation_participants.conversationId, conversations.id),
      isNotNull(conversation_participants.blockedAt),
    ))),
    exists(db.select({ one: user.id }).from(user).where(and(eq(user.id, conversations.sellerId), eq(user.isActive, true)))),
    // An open question from the same buyer is timed on its own, so the chat is left out to avoid counting one ignored buyer twice.
    notExists(db.select({ one: order_inquiries.id }).from(order_inquiries).where(and(
      eq(order_inquiries.buyerId, conversations.buyerId), eq(order_inquiries.sellerId, conversations.sellerId), isNull(order_inquiries.repliedAt),
    ))),
    notExists(db.select({ one: product_inquiries.id }).from(product_inquiries).where(and(
      eq(product_inquiries.buyerId, conversations.buyerId), eq(product_inquiries.sellerId, conversations.sellerId), isNull(product_inquiries.repliedAt),
    ))),
  );
  const due = await db.select({ id: conversations.id }).from(conversations).where(eligible).limit(limit);
  for (const row of due) {
    const flagged = await db.transaction(async (tx) => {
      const [current] = await tx.select().from(conversations)
        .where(and(eq(conversations.id, row.id), eligible)).for("update").limit(1);
      if (!current?.awaitingReplySince) return null;
      const result = await recordReplyDeadlines(tx, {
        key: `chat-${current.id}-${current.awaitingReplySince.getTime()}`, orderId: null, buyerId: current.buyerId,
        sellerId: current.sellerId, since: current.awaitingReplySince, sourceId: current.id,
      }, now);
      await tx.update(conversations).set({ deadlineStage: result.stage }).where(eq(conversations.id, current.id));
      return result.flagged ? { sellerId: current.sellerId, eventKey: result.eventKey } : null;
    });
    if (flagged) await evaluateTrustAction(flagged.sellerId, null, flagged.eventKey, "inquiry_non_response");
  }
  return due.length;
}

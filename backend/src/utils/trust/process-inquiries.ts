import { and, eq, exists, isNull, lte, or } from "drizzle-orm";
import { db } from "../../db";
import { order_inquiries, product_inquiries, user } from "../../db/schema";
import { evaluateTrustAction } from "./evaluate-action";
import { processChatDeadlines } from "./process-chats";
import { recordReplyDeadlines } from "./response-deadlines";

const hoursAgo = (now: Date, hours: number) => new Date(now.getTime() - hours * 3_600_000);

/** Only sellers who can still reply are timed. Checking it in the query keeps skipped rows from crowding out the rest. */
const activeSeller = (sellerId: typeof order_inquiries.sellerId | typeof product_inquiries.sellerId) =>
  exists(db.select({ one: user.id }).from(user).where(and(eq(user.id, sellerId), eq(user.isActive, true))));

async function processOrderInquiries(now: Date, limit: number) {
  const dueCondition = or(
    and(eq(order_inquiries.deadlineStage, 0), lte(order_inquiries.createdAt, hoursAgo(now, 12))),
    and(eq(order_inquiries.deadlineStage, 1), lte(order_inquiries.createdAt, hoursAgo(now, 24))),
    and(eq(order_inquiries.deadlineStage, 2), lte(order_inquiries.createdAt, hoursAgo(now, 48))),
  );
  const due = await db.select().from(order_inquiries)
    .where(and(isNull(order_inquiries.repliedAt), activeSeller(order_inquiries.sellerId), dueCondition)).limit(limit);
  for (const row of due) {
    const flagged = await db.transaction(async (tx) => {
      const [current] = await tx.select().from(order_inquiries)
        .where(and(eq(order_inquiries.id, row.id), isNull(order_inquiries.repliedAt), dueCondition))
        .for("update").limit(1);
      if (!current) return null;
      const result = await recordReplyDeadlines(tx, {
        key: current.id, orderId: current.orderId, buyerId: current.buyerId,
        sellerId: current.sellerId, since: current.createdAt, sourceId: current.id,
      }, now);
      await tx.update(order_inquiries).set({ deadlineStage: result.stage }).where(eq(order_inquiries.id, current.id));
      return result.flagged ? { sellerId: current.sellerId, orderId: current.orderId, eventKey: result.eventKey } : null;
    });
    if (flagged) await evaluateTrustAction(flagged.sellerId, flagged.orderId, flagged.eventKey, "inquiry_non_response");
  }
  return due.length;
}

async function processProductInquiries(now: Date, limit: number) {
  const dueCondition = or(
    and(eq(product_inquiries.deadlineStage, 0), lte(product_inquiries.createdAt, hoursAgo(now, 12))),
    and(eq(product_inquiries.deadlineStage, 1), lte(product_inquiries.createdAt, hoursAgo(now, 24))),
    and(eq(product_inquiries.deadlineStage, 2), lte(product_inquiries.createdAt, hoursAgo(now, 48))),
  );
  const due = await db.select().from(product_inquiries)
    .where(and(isNull(product_inquiries.repliedAt), activeSeller(product_inquiries.sellerId), dueCondition)).limit(limit);
  for (const row of due) {
    const flagged = await db.transaction(async (tx) => {
      const [current] = await tx.select().from(product_inquiries)
        .where(and(eq(product_inquiries.id, row.id), isNull(product_inquiries.repliedAt), dueCondition))
        .for("update").limit(1);
      if (!current) return null;
      const result = await recordReplyDeadlines(tx, {
        key: current.id, orderId: null, buyerId: current.buyerId,
        sellerId: current.sellerId, since: current.createdAt, sourceId: current.id,
      }, now);
      await tx.update(product_inquiries).set({ deadlineStage: result.stage }).where(eq(product_inquiries.id, current.id));
      return result.flagged ? { sellerId: current.sellerId, eventKey: result.eventKey } : null;
    });
    if (flagged) await evaluateTrustAction(flagged.sellerId, null, flagged.eventKey, "inquiry_non_response");
  }
  return due.length;
}

/** Runs the 12h / 24h / 48h reply timers for order questions, product questions and direct chats. */
export async function processInquiryDeadlines(limit = 100) {
  const now = new Date();
  const orders = await processOrderInquiries(now, limit);
  const products = await processProductInquiries(now, limit);
  const chats = await processChatDeadlines(now, limit);
  return orders + products + chats;
}

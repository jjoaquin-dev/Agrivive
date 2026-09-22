import { and, eq, isNull, lte, or } from "drizzle-orm";
import { db } from "../../db";
import { order_inquiries } from "../../db/schema";
import { recordInquiryDeadlines } from "./index";

export async function processInquiryDeadlines(limit = 100) {
  const now = new Date();
  const dueCondition = or(
    and(eq(order_inquiries.deadlineStage, 0), lte(order_inquiries.createdAt, new Date(now.getTime() - 12 * 3_600_000))),
    and(eq(order_inquiries.deadlineStage, 1), lte(order_inquiries.createdAt, new Date(now.getTime() - 24 * 3_600_000))),
    and(eq(order_inquiries.deadlineStage, 2), lte(order_inquiries.createdAt, new Date(now.getTime() - 48 * 3_600_000))),
  );
  const due = await db.select().from(order_inquiries).where(and(
    isNull(order_inquiries.repliedAt),
    dueCondition,
  )).limit(limit);
  for (const row of due) {
    await db.transaction(async (tx) => {
      const [current] = await tx.select().from(order_inquiries)
        .where(and(eq(order_inquiries.id, row.id), isNull(order_inquiries.repliedAt), dueCondition))
        .for("update").limit(1);
      if (current) {
        await recordInquiryDeadlines(tx, current, now);
        const age = (now.getTime() - current.createdAt.getTime()) / 3_600_000;
        await tx.update(order_inquiries).set({ deadlineStage: age >= 48 ? 3 : age >= 24 ? 2 : 1 })
          .where(eq(order_inquiries.id, current.id));
      }
    });
  }
  return due.length;
}

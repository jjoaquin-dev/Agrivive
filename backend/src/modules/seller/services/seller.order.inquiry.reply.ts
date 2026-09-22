import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { order_inquiries } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { recordInquiryDeadlines } from "../../../utils/trust";

export function replySellerInquiry(sellerId: string, inquiryId: string, reply: string) {
  if (!reply.trim()) throw new OrderError(400, "Reply is required");
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [inquiry] = await tx.select().from(order_inquiries).where(and(
      eq(order_inquiries.id, inquiryId), eq(order_inquiries.sellerId, sellerId),
    )).for("update").limit(1);
    if (!inquiry) throw new OrderError(404, "Inquiry not found");
    if (inquiry.repliedAt) throw new OrderError(409, "Inquiry already answered");
    const now = new Date();
    await recordInquiryDeadlines(tx, inquiry, now);
    const [updated] = await tx.update(order_inquiries).set({ reply: reply.trim(), repliedAt: now })
      .where(and(eq(order_inquiries.id, inquiryId), isNull(order_inquiries.repliedAt))).returning();
    return updated;
  });
}

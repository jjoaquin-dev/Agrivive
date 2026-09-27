import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { product_inquiries } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export async function replySellerProductInquiry(sellerId: string, inquiryId: string, reply: string) {
  const text = reply.trim();
  if (!text) throw new OrderError(400, "Reply is required");
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [inquiry] = await tx.select().from(product_inquiries).where(and(
      eq(product_inquiries.id, inquiryId), eq(product_inquiries.sellerId, sellerId),
    )).for("update").limit(1);
    if (!inquiry) throw new OrderError(404, "Product inquiry not found");
    if (inquiry.repliedAt) throw new OrderError(409, "Product inquiry already answered");
    const [updated] = await tx.update(product_inquiries).set({ reply: text, repliedAt: new Date() })
      .where(and(
        eq(product_inquiries.id, inquiryId),
        eq(product_inquiries.sellerId, sellerId),
        isNull(product_inquiries.repliedAt),
      )).returning();
    if (!updated) throw new OrderError(404, "Open product inquiry not found");
    return updated;
  });
}

import { and, asc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { product_inquiries } from "../../../db/schema";

export function listBuyerProductInquiries(buyerId: string, productId: string) {
  return db.select({
    id: product_inquiries.id,
    productId: product_inquiries.productId,
    question: product_inquiries.question,
    reply: product_inquiries.reply,
    repliedAt: product_inquiries.repliedAt,
    createdAt: product_inquiries.createdAt,
  }).from(product_inquiries).where(and(
    eq(product_inquiries.buyerId, buyerId),
    eq(product_inquiries.productId, productId),
  )).orderBy(asc(product_inquiries.createdAt));
}

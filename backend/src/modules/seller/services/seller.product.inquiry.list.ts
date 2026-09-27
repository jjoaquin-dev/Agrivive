import { and, desc, eq, isNull, lt, or } from "drizzle-orm";
import { db } from "../../../db";
import { product_inquiries, sellers_product } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import type { SellerProductInquiryQuery } from "../model/seller.product.inquiry";

export async function listSellerProductInquiries(sellerId: string, query: SellerProductInquiryQuery) {
  const limit = query.limit ?? 20;
  const openOnly = query.status === "open";
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    let before;
    if (query.cursor) {
      const [anchor] = await tx.select({ id: product_inquiries.id, createdAt: product_inquiries.createdAt })
        .from(product_inquiries).where(and(
          eq(product_inquiries.id, query.cursor), eq(product_inquiries.sellerId, sellerId),
        )).limit(1);
      if (!anchor) throw new OrderError(400, "Invalid inquiry cursor");
      before = or(
        lt(product_inquiries.createdAt, anchor.createdAt),
        and(eq(product_inquiries.createdAt, anchor.createdAt), lt(product_inquiries.id, anchor.id)),
      );
    }
    const rows = await tx.select({
      id: product_inquiries.id,
      productId: product_inquiries.productId,
      productName: sellers_product.productName,
      buyerId: product_inquiries.buyerId,
      question: product_inquiries.question,
      reply: product_inquiries.reply,
      repliedAt: product_inquiries.repliedAt,
      createdAt: product_inquiries.createdAt,
    }).from(product_inquiries).innerJoin(sellers_product, eq(product_inquiries.productId, sellers_product.id))
      .where(and(
        eq(product_inquiries.sellerId, sellerId),
        openOnly ? isNull(product_inquiries.repliedAt) : undefined,
        before,
      )).orderBy(desc(product_inquiries.createdAt), desc(product_inquiries.id)).limit(limit + 1);
    const page = rows.slice(0, limit);
    const last = page[page.length - 1];
    return { items: page, nextCursor: rows.length > limit ? last?.id ?? null : null };
  });
}

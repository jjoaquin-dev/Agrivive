import { and, desc, eq, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_inquiries, orders } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import type { SellerInquiryListQuery } from "../model/seller.inquiry.list";

export async function listSellerInquiries(
  sellerId: string,
  query: SellerInquiryListQuery = {},
) {
  const limit = query.limit ?? 20;
  const openOnly = query.status === "open";

  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);

    const openCondition = openOnly ? isNull(order_inquiries.reply) : undefined;
    let before;

    if (query.cursor) {
      const [anchor] = await tx.select({
        id: order_inquiries.id,
        createdAt: order_inquiries.createdAt,
      }).from(order_inquiries).where(and(
        eq(order_inquiries.id, query.cursor),
        eq(order_inquiries.sellerId, sellerId),
      )).limit(1);

      if (!anchor) throw new OrderError(400, "Invalid inquiry cursor");
      before = or(
        lt(order_inquiries.createdAt, anchor.createdAt),
        and(
          eq(order_inquiries.createdAt, anchor.createdAt),
          lt(order_inquiries.id, anchor.id),
        ),
      );
    }

    const rows = await tx.select({
      id: order_inquiries.id,
      orderId: order_inquiries.orderId,
      buyerId: order_inquiries.buyerId,
      question: order_inquiries.question,
      reply: order_inquiries.reply,
      repliedAt: order_inquiries.repliedAt,
      createdAt: order_inquiries.createdAt,
      orderStatus: orders.status,
      totalAmount: orders.totalAmount,
    }).from(order_inquiries)
      .innerJoin(orders, eq(order_inquiries.orderId, orders.id))
      .where(and(
        eq(order_inquiries.sellerId, sellerId),
        openCondition,
        before,
      ))
      .orderBy(desc(order_inquiries.createdAt), desc(order_inquiries.id))
      .limit(limit + 1);

    const [openCount] = await tx.select({
      count: sql<number>`count(*)::int`,
    }).from(order_inquiries).where(and(
      eq(order_inquiries.sellerId, sellerId),
      isNull(order_inquiries.reply),
    ));

    const page = rows.slice(0, limit);
    return {
      items: page,
      nextCursor: rows.length > limit && page.length > 0 ? page[page.length - 1].id : null,
      openCount: Number(openCount?.count ?? 0),
    };
  });
}

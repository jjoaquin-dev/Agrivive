import { and, eq, gt, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { product_inquiries, sellers_product, sellers_profile, user } from "../../../db/schema";
import { requireActiveUser } from "../../../utils/order-access";
import { OrderError } from "../../../utils/order-types";

export async function createBuyerProductInquiry(buyerId: string, productId: string, question: string) {
  const text = question.trim();
  if (!text) throw new OrderError(400, "Question is required");

  return db.transaction(async (tx) => {
    await requireActiveUser(tx, buyerId, "buyer");
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${productId}), 4)`);
    const [product] = await tx.select({ id: sellers_product.id, sellerId: sellers_product.userId })
      .from(sellers_product)
      .innerJoin(user, eq(user.id, sellers_product.userId))
      .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
      .where(and(
        eq(sellers_product.id, productId),
        eq(sellers_product.isActive, true),
        eq(sellers_product.isMarketable, true),
        gt(sellers_product.productQty, "0"),
        eq(user.isActive, true),
        eq(user.emailVerified, true),
        sql`'seller' = ANY(coalesce(${user.role}, ARRAY[]::"role"[]))`,
        eq(sellers_profile.isCurrent, true),
        isNotNull(sellers_profile.latitude),
        isNotNull(sellers_profile.longitude),
        sql`length(btrim(${sellers_profile.shopName})) > 0`,
        sql`length(btrim(${sellers_profile.detailAddress})) > 0`,
        sql`length(btrim(coalesce(${sellers_profile.phoneNumber}, ''))) >= 7`,
      )).limit(1);
    if (!product) throw new OrderError(404, "Marketplace product not found");
    if (product.sellerId === buyerId) throw new OrderError(403, "You cannot message your own listing");

    const [openInquiry] = await tx.select({ id: product_inquiries.id })
      .from(product_inquiries).where(and(
        eq(product_inquiries.productId, productId),
        eq(product_inquiries.buyerId, buyerId),
        isNull(product_inquiries.repliedAt),
      )).limit(1);
    if (openInquiry) throw new OrderError(409, "An inquiry is already awaiting a reply");

    const [inquiry] = await tx.insert(product_inquiries).values({
      productId, buyerId, sellerId: product.sellerId, question: text,
    }).returning();
    return inquiry;
  });
}

import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { order_inquiries, orders, sellers_product, sellers_profile } from "../../../db/schema";
import { requireActiveUser } from "../../../utils/order-access";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export function deleteSellerProfile(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId, false);
    await requireActiveUser(tx, sellerId, "seller");
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${sellerId}), 3)`);

    const [profile] = await tx.select({ id: sellers_profile.id }).from(sellers_profile).where(and(
      eq(sellers_profile.userId, sellerId), eq(sellers_profile.isCurrent, true),
    )).for("update").limit(1);

    const now = new Date();
    await tx.update(sellers_product).set({ isActive: false, updatedAt: now }).where(and(
      eq(sellers_product.userId, sellerId), eq(sellers_product.isActive, true),
    ));
    const [pending] = await tx.select({ id: orders.id }).from(orders).where(and(
      eq(orders.sellersId, sellerId), eq(orders.status, "pending"), gt(orders.expiresAt, now),
    )).limit(1);
    if (pending) throw new OrderError(409, "Complete or resolve pending orders before archiving your profile");
    const [inquiry] = await tx.select({ id: order_inquiries.id }).from(order_inquiries).where(and(
      eq(order_inquiries.sellerId, sellerId), isNull(order_inquiries.repliedAt),
    )).limit(1);
    if (inquiry) throw new OrderError(409, "Reply to open inquiries before archiving your profile");

    if (profile) {
      await tx.update(sellers_profile).set({ isCurrent: false, updatedAt: now })
        .where(eq(sellers_profile.id, profile.id));
    }
  });
}

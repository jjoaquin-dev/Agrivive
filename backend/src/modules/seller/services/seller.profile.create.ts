import { db } from "../../../db";
import { and, eq, sql } from "drizzle-orm";
import { sellers_profile, user } from "../../../db/schema";
import type { SellerProfileCreate } from "../model/seller.profile.create";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { OrderError } from "../../../utils/order-types";

export async function createSellerProfile(userId: string, body: SellerProfileCreate) {
  const shopName = body.shopName.trim();
  const detailAddress = body.detailAddress.trim();
  const phoneNumber = body.phoneNumber.trim();
  if (!shopName || !detailAddress || !phoneNumber) {
    throw new OrderError(400, "Shop name, address, and phone number are required");
  }
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, userId, false);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${userId}), 3)`);
    const [existing] = await tx.select({ id: sellers_profile.id }).from(sellers_profile)
      .where(and(eq(sellers_profile.userId, userId), eq(sellers_profile.isCurrent, true))).limit(1);
    if (existing) throw new OrderError(409, "Seller profile already exists");
    const [postSellerProfile] = await tx
      .insert(sellers_profile)
      .values({
        shopName,
        detailAddress,
        latitude: body.latitude,
        longitude: body.longitude,
        phoneNumber,
        userId,
      })
      .returning();

    if (!postSellerProfile) {
      throw new Error("Failed to post seller");
    }
    await tx
      .update(user)
      .set({
        role: sql`array_append(coalesce(${user.role}, ARRAY[]::"role"[]), 'seller'::"role")`,
      })
      .where(
        and(
          eq(user.id, userId),
          sql`NOT ('seller'::"role" = ANY(coalesce(${user.role}, ARRAY[]::"role"[])))`,
        ),
      );
    return postSellerProfile;
  });
}

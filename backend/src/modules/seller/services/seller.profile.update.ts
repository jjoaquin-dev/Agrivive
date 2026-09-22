import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_profile } from "../../../db/schema";
import { requireActiveUser } from "../../../utils/order-access";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import type { SellerProfileUpdate } from "../model/seller.profile.update";

export function updateSellerProfile(sellerId: string, body: SellerProfileUpdate) {
  if (Object.keys(body).length === 0) throw new OrderError(400, "At least one profile field is required");
  const shopName = body.shopName?.trim();
  const detailAddress = body.detailAddress?.trim();
  const phoneNumber = body.phoneNumber?.trim();
  if (shopName === "" || detailAddress === "" || phoneNumber === "") {
    throw new OrderError(400, "Profile text fields cannot be blank");
  }
  if (body.latitude !== undefined && (!Number.isFinite(body.latitude) || body.latitude < -90 || body.latitude > 90)) {
    throw new OrderError(400, "Latitude must be between -90 and 90");
  }
  if (body.longitude !== undefined && (!Number.isFinite(body.longitude) || body.longitude < -180 || body.longitude > 180)) {
    throw new OrderError(400, "Longitude must be between -180 and 180");
  }
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId, false);
    await requireActiveUser(tx, sellerId, "seller");
    const [profile] = await tx.update(sellers_profile).set({
      ...(shopName !== undefined ? { shopName } : {}),
      ...(detailAddress !== undefined ? { detailAddress } : {}),
      ...(body.latitude !== undefined ? { latitude: body.latitude } : {}),
      ...(body.longitude !== undefined ? { longitude: body.longitude } : {}),
      ...(phoneNumber !== undefined ? { phoneNumber } : {}),
      updatedAt: new Date(),
    }).where(and(
      eq(sellers_profile.userId, sellerId), eq(sellers_profile.isCurrent, true),
    )).returning();
    if (!profile) throw new OrderError(404, "Seller profile not found");
    return profile;
  });
}

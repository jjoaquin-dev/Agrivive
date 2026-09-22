import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_profile } from "../../../db/schema";
import { requireActiveUser } from "../../../utils/order-access";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export function readSellerProfile(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId, false);
    await requireActiveUser(tx, sellerId, "seller");
    const [profile] = await tx.select().from(sellers_profile).where(and(
      eq(sellers_profile.userId, sellerId), eq(sellers_profile.isCurrent, true),
    )).limit(1);
    if (!profile) throw new OrderError(404, "Seller profile not found");
    return profile;
  });
}

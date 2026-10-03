import { and, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_profile, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getAvatarDisplayUrl } from "../../../utils/s3-avatar";

const sellerRole = sql`'seller' = ANY(coalesce(${user.role}, ARRAY[]::"role"[]))`;

export async function getMarketplaceSeller(sellerId: string) {
  const [seller] = await db.select({
    id: sellers_profile.userId,
    image: user.image,
    shopName: sellers_profile.shopName,
    sellerType: sellers_profile.sellerType,
    detailAddress: sellers_profile.detailAddress,
    pickupInstructions: sellers_profile.pickupInstructions,
    latitude: sellers_profile.latitude,
    longitude: sellers_profile.longitude,
  })
    .from(sellers_profile)
    .innerJoin(user, eq(user.id, sellers_profile.userId))
    .where(and(
      eq(sellers_profile.userId, sellerId),
      eq(sellers_profile.isCurrent, true),
      eq(user.isActive, true),
      eq(user.emailVerified, true),
      sellerRole,
      sql`length(btrim(${sellers_profile.shopName})) > 0`,
      sql`length(btrim(${sellers_profile.detailAddress})) > 0`,
      sql`length(btrim(coalesce(${sellers_profile.phoneNumber}, ''))) >= 7`,
      isNotNull(sellers_profile.latitude),
      isNotNull(sellers_profile.longitude),
    ))
    .limit(1);

  if (!seller) throw new OrderError(404, "Seller storefront not found");
  return {
    ...seller,
    image: await getAvatarDisplayUrl(seller.image),
  };
}

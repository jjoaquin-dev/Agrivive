import { and, desc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_follows, sellers_profile, user } from "../../../db/schema";

/** Every seller this buyer follows, newest first. Sellers that are switched off are left out. */
export async function listBuyerSellerFollows(buyerId: string) {
  const rows = await db.select({
    sellerId: seller_follows.sellerId,
    followedAt: seller_follows.createdAt,
    shopName: sellers_profile.shopName,
    address: sellers_profile.detailAddress,
    image: user.image,
  }).from(seller_follows)
    .innerJoin(user, eq(user.id, seller_follows.sellerId))
    .innerJoin(sellers_profile, and(eq(sellers_profile.userId, seller_follows.sellerId), eq(sellers_profile.isCurrent, true)))
    .where(and(eq(seller_follows.buyerId, buyerId), eq(user.isActive, true)))
    .orderBy(desc(seller_follows.createdAt)).limit(200);
  return { sellers: rows };
}

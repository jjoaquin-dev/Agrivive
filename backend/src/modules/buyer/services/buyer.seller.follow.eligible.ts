import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_profile, user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { marketplaceSellerVisibility } from "../../marketplace/services/marketplace.visibility";

export async function requireFollowableSeller(buyerId: string, sellerId: string) {
  if (buyerId === sellerId) throw new OrderError(403, "You cannot follow your own shop");
  const [seller] = await db.select({ id: sellers_profile.userId })
    .from(sellers_profile)
    .innerJoin(user, eq(user.id, sellers_profile.userId))
    .where(and(
      eq(sellers_profile.userId, sellerId),
      marketplaceSellerVisibility(),
      isNotNull(sellers_profile.latitude),
      isNotNull(sellers_profile.longitude),
    )).limit(1);
  if (!seller) throw new OrderError(404, "Seller storefront not found");
  return seller.id;
}

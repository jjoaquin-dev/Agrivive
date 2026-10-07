import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_follows } from "../../../db/schema";
import { requireFollowableSeller } from "./buyer.seller.follow.eligible";

export async function readBuyerSellerFollow(buyerId: string, sellerId: string) {
  await requireFollowableSeller(buyerId, sellerId);
  const [follow] = await db.select({ id: seller_follows.id }).from(seller_follows)
    .where(and(eq(seller_follows.buyerId, buyerId), eq(seller_follows.sellerId, sellerId)))
    .limit(1);
  return { sellerId, following: Boolean(follow) };
}

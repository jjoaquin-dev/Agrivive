import { db } from "../../../db";
import { seller_follows } from "../../../db/schema";
import { requireFollowableSeller } from "./buyer.seller.follow.eligible";

export async function saveBuyerSellerFollow(buyerId: string, sellerId: string) {
  await requireFollowableSeller(buyerId, sellerId);
  await db.insert(seller_follows).values({ buyerId, sellerId })
    .onConflictDoNothing({ target: [seller_follows.buyerId, seller_follows.sellerId] });
  return { sellerId, following: true };
}

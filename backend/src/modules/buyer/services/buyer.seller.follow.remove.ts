import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_follows } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

export async function removeBuyerSellerFollow(buyerId: string, sellerId: string) {
  if (buyerId === sellerId) throw new OrderError(403, "You cannot follow your own shop");
  await db.delete(seller_follows).where(and(
    eq(seller_follows.buyerId, buyerId), eq(seller_follows.sellerId, sellerId),
  ));
  return { sellerId, following: false };
}

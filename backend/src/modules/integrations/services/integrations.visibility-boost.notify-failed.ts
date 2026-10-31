import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { createSellerNotification } from "../../../utils/seller-notifications";

/** Tells the seller a Boost post did not go out. One notice per boost and post type. Never fails the request. */
export async function notifyBoostFailed(boostId: string, postType: "first_post" | "second_post") {
  try {
    const [row] = await db.select({
      sellerId: seller_visibility_boosts.sellerId,
      productId: seller_visibility_boosts.productId,
      productName: sellers_product.productName,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(eq(seller_visibility_boosts.id, boostId)).limit(1);
    if (!row) return;
    await db.transaction((tx) => createSellerNotification(tx, {
      sellerId: row.sellerId,
      kind: "boost_failed",
      dedupeKey: `boost-failed:${boostId}:${postType}`,
      productId: row.productId,
      payload: { productName: row.productName },
    }));
  } catch (error) {
    console.error("Boost failed notification failed", { boostId, error });
  }
}

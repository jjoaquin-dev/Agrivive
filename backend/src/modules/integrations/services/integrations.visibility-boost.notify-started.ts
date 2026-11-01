import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { createSellerNotification } from "../../../utils/seller-notifications";

/** Tells the seller the first Boost post is out. Never fails the post. */
export async function notifyBoostStarted(boostId: string) {
  try {
    const [row] = await db.select({
      sellerId: seller_visibility_boosts.sellerId,
      productId: seller_visibility_boosts.productId,
      productName: sellers_product.productName,
      followUpDueAt: seller_visibility_boosts.followUpDueAt,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(eq(seller_visibility_boosts.id, boostId)).limit(1);
    if (!row) return;
    await db.transaction((tx) => createSellerNotification(tx, {
      sellerId: row.sellerId,
      kind: "boost_started",
      dedupeKey: `boost-started:${boostId}`,
      productId: row.productId,
      payload: {
        productName: row.productName,
        // Set when the first post was saved: only a Priority Boost listing with a drop set up has a timer.
        willLowerPrice: row.followUpDueAt !== null,
      },
    }));
  } catch (error) {
    console.error("Boost started notification failed", { boostId, error });
  }
}

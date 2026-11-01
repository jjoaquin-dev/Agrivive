import { and, eq, isNotNull, isNull, lte } from "drizzle-orm";
import { db } from "../db";
import { seller_visibility_boosts as boosts, sellers_product as products } from "../db/schema";
import { createSellerNotification } from "../utils/seller-notifications";

/**
 * Six hours after a Priority Boost listing's first post, asks the seller to set the peso drop and the final price.
 * The saved time is kept so the Boost screen can still show it; the notified time makes this run once per boost.
 */
export async function sendPriceDropSetupNotices(limit = 25) {
  const now = new Date();
  const due = await db.select({
    id: boosts.id, sellerId: boosts.sellerId, productId: boosts.productId, productName: products.productName,
    enabled: products.priceReductionEnabled, amount: products.priceReductionAmount, minimumPrice: products.minimumPrice,
  }).from(boosts).innerJoin(products, eq(products.id, boosts.productId)).where(and(
    isNotNull(boosts.priceDropSetupAt), lte(boosts.priceDropSetupAt, now), isNull(boosts.priceDropSetupNotifiedAt),
  )).limit(limit);

  let sent = 0;
  for (const boost of due) {
    // The seller already set it before the 6 hours were up (the setup time is cleared then); nothing to ask.
    const alreadySet = boost.enabled && Number(boost.amount ?? 0) > 0 && boost.minimumPrice !== null;
    try {
      await db.transaction(async (tx) => {
        if (!alreadySet) {
          await createSellerNotification(tx, {
            sellerId: boost.sellerId, kind: "price_drop_setup", dedupeKey: `price-drop-setup:${boost.id}`,
            productId: boost.productId, payload: { productName: boost.productName },
          });
        }
        await tx.update(boosts).set({ priceDropSetupNotifiedAt: now }).where(eq(boosts.id, boost.id));
      });
      if (!alreadySet) sent++;
    } catch (error) {
      console.error("Price drop setup notice failed", { boostId: boost.id, error });
    }
  }
  return { due: due.length, sent };
}

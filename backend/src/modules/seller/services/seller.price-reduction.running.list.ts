import { and, asc, eq, isNotNull } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts, sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { readPriceDropNow } from "./seller.price-reduction.drop-now.read";

/** Listings whose 6-hour price drop rule is running: when the next drop comes, and whether it can be brought forward now. */
export async function listSellerRunningPriceDrops(sellerId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const rows = await tx.select({
      boostId: seller_visibility_boosts.id,
      productId: sellers_product.id,
      productName: sellers_product.productName,
      imageUrl: sellers_product.imagUrl,
      currentPrice: sellers_product.productPrice,
      lowestPrice: sellers_product.minimumPrice,
      dropAmount: sellers_product.priceReductionAmount,
      nextDropAt: seller_visibility_boosts.followUpDueAt,
    }).from(seller_visibility_boosts)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_visibility_boosts.productId))
      .where(and(
        eq(seller_visibility_boosts.sellerId, sellerId),
        eq(seller_visibility_boosts.reason, "initial"),
        eq(seller_visibility_boosts.status, "sent"),
        isNotNull(seller_visibility_boosts.followUpDueAt),
        eq(sellers_product.isActive, true),
        eq(sellers_product.priceReductionEnabled, true),
      )).orderBy(asc(seller_visibility_boosts.followUpDueAt));

    const items = [];
    for (const row of rows) {
      const now = await readPriceDropNow(tx, sellerId, row.productId);
      items.push({
        boostId: row.boostId,
        productId: row.productId,
        productName: row.productName,
        imageUrl: row.imageUrl,
        currentPrice: Number(row.currentPrice ?? 0),
        lowestPrice: row.lowestPrice ? Number(row.lowestPrice) : null,
        dropAmount: Number(row.dropAmount ?? 0),
        nextDropAt: row.nextDropAt ? row.nextDropAt.toISOString() : null,
        available: now.available,
        message: now.message,
        waitUntil: now.waitUntil,
      });
    }
    return { items };
  });
}

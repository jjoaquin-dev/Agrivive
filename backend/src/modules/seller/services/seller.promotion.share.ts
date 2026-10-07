import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_promotion_jobs } from "../../../db/schema";
import { getPriorityPromotionEligibility } from "../../../utils/promotion-eligibility";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

function quantityLabel(value: string | null, unit: string) {
  const quantity = Number(value);
  return `${quantity.toLocaleString("en-PH", { maximumFractionDigits: 2 })} ${unit}`;
}

export async function getSellerPromotionShare(sellerId: string, promotionId: string) {
  const job = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [row] = await tx.select({
      id: seller_promotion_jobs.id,
      listingCycleId: seller_promotion_jobs.listingCycleId,
      stage: seller_promotion_jobs.stage,
      headline: seller_promotion_jobs.headline,
      caption: seller_promotion_jobs.caption,
    }).from(seller_promotion_jobs).where(and(
      eq(seller_promotion_jobs.id, promotionId),
      eq(seller_promotion_jobs.sellerId, sellerId),
      eq(seller_promotion_jobs.status, "ready"),
    )).limit(1);
    if (!row) throw new OrderError(404, "Promotion draft not found");
    return row;
  });

  const listing = await getPriorityPromotionEligibility(job.listingCycleId);
  if (!listing?.eligible) {
    throw new OrderError(409, "This listing is no longer eligible to share");
  }

  const shareUrl = listing.listingUrl;
  const price = Number(listing.price).toFixed(2);
  const available = quantityLabel(listing.quantity, listing.unit);
  const message = [
    job.headline,
    job.caption,
    `${listing.productName} from ${listing.shopName}`,
    `₱${price} per ${listing.unit} · ${available} available`,
    shareUrl,
  ].filter(Boolean).join("\n\n");

  return {
    promotionId: job.id,
    stage: job.stage,
    title: listing.productName,
    message,
    shareUrl,
    facts: {
      productName: listing.productName,
      shopName: listing.shopName,
      price: Number(price),
      quantity: Number(listing.quantity),
      unit: listing.unit,
    },
  };
}

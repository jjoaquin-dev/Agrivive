import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_social_campaigns, sellers_product } from "../../../db/schema";
import { createSellerNotification } from "../../../utils/seller-notifications";

/** Tells the seller how a Boost post ended. Partial results are left to the campaign screen. */
export async function notifySocialCampaignResult(campaignId: string, status: string) {
  if (status !== "published" && status !== "failed") return;
  try {
    const [campaign] = await db.select({
      sellerId: seller_social_campaigns.sellerId,
      productId: seller_social_campaigns.productId,
      productName: sellers_product.productName,
    }).from(seller_social_campaigns)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_social_campaigns.productId))
      .where(eq(seller_social_campaigns.id, campaignId)).limit(1);
    if (!campaign) return;
    const kind = status === "published" ? "boost_posted" : "boost_failed";
    await db.transaction((tx) => createSellerNotification(tx, {
      sellerId: campaign.sellerId,
      kind,
      dedupeKey: `${kind.replace("_", "-")}:${campaignId}`,
      productId: campaign.productId,
      payload: { productName: campaign.productName },
    }));
  } catch (error) {
    console.error("Boost result notification failed", { campaignId, error });
  }
}

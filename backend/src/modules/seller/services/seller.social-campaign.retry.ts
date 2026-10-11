import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { seller_social_campaign_posts, seller_social_campaigns } from "../../../db/schema";
import { getPriorityPromotionEligibility } from "../../../utils/promotion-eligibility";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { OrderError } from "../../../utils/order-types";
import { dispatchSocialCampaign } from "./seller.social-campaign.dispatch";

export async function retrySellerSocialCampaign(sellerId: string, campaignId: string) {
  const selected = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [campaign] = await tx.select().from(seller_social_campaigns).where(and(
      eq(seller_social_campaigns.id, campaignId), eq(seller_social_campaigns.sellerId, sellerId),
    )).limit(1);
    if (!campaign) throw new OrderError(404, "Boost Visibility post not found");
    if (campaign.status !== "failed" && campaign.status !== "partial") {
      throw new OrderError(409, "There are no failed channels to retry");
    }
    const failed = await tx.select({ platform: seller_social_campaign_posts.platform })
      .from(seller_social_campaign_posts).where(and(
        eq(seller_social_campaign_posts.campaignId, campaignId),
        eq(seller_social_campaign_posts.status, "failed"),
      ));
    if (!failed.length) throw new OrderError(409, "There are no failed channels to retry");
    const eligibility = await getPriorityPromotionEligibility(campaign.listingCycleId);
    if (!eligibility?.eligible || eligibility.sellerId !== sellerId) {
      throw new OrderError(409, eligibility?.reason ?? "This listing is no longer ready for Boost Visibility");
    }
    await tx.update(seller_social_campaign_posts).set({
      status: "queued", lastError: null, completedAt: null, updatedAt: new Date(),
    }).where(and(
      eq(seller_social_campaign_posts.campaignId, campaignId),
      eq(seller_social_campaign_posts.status, "failed"),
    ));
    await tx.update(seller_social_campaigns).set({
      status: "queued", completedAt: null, lastError: null,
      retryCount: sql`${seller_social_campaigns.retryCount} + 1`, updatedAt: new Date(),
    }).where(eq(seller_social_campaigns.id, campaignId));
    return { platforms: failed.map((post) => post.platform), previousStatus: campaign.status };
  });

  try {
    await dispatchSocialCampaign(campaignId);
  } catch (error) {
    await db.transaction(async (tx) => {
      await tx.update(seller_social_campaign_posts).set({
        status: "failed", lastError: "Could not start posting. Please try again.", completedAt: new Date(), updatedAt: new Date(),
      }).where(and(
        eq(seller_social_campaign_posts.campaignId, campaignId),
        eq(seller_social_campaign_posts.status, "queued"),
      ));
      await tx.update(seller_social_campaigns).set({
        status: selected.previousStatus, lastError: "Could not start posting. Please try again.",
        completedAt: new Date(), updatedAt: new Date(),
      }).where(eq(seller_social_campaigns.id, campaignId));
    });
    console.error("Could not retry official-channel publishing", { campaignId, message: error instanceof Error ? error.message : "unknown" });
    if (error instanceof OrderError) throw error;
    throw new OrderError(502, "Could not start the retry. Your successful posts were kept.");
  }
  return { campaignId, status: "queued" as const, retrying: selected.platforms };
}

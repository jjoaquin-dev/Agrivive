import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_social_campaigns, seller_social_campaign_posts } from "../../../db/schema";
import { getPriorityPromotionEligibility } from "../../../utils/promotion-eligibility";
import { OrderError } from "../../../utils/order-types";
import { notifySocialCampaignResult } from "./integrations.social-publish-notify";

export async function getSocialPublishContext(campaignId: string) {
  const [campaign] = await db.select().from(seller_social_campaigns)
    .where(eq(seller_social_campaigns.id, campaignId)).limit(1);
  if (!campaign) throw new OrderError(404, "Social campaign not found");
  if (!["queued", "publishing", "processing"].includes(campaign.status)) {
    throw new OrderError(409, "Social campaign is not awaiting publication");
  }
  const eligibility = await getPriorityPromotionEligibility(campaign.listingCycleId, { stage: "followup", allowActiveListing: true });
  if (!eligibility?.eligible || eligibility.sellerId !== campaign.sellerId) {
    await db.update(seller_social_campaigns).set({
      status: "failed", lastError: "Listing is no longer eligible", completedAt: new Date(), updatedAt: new Date(),
    }).where(eq(seller_social_campaigns.id, campaignId));
    await db.update(seller_social_campaign_posts).set({
      status: "failed", lastError: "Listing is no longer eligible", completedAt: new Date(), updatedAt: new Date(),
    }).where(eq(seller_social_campaign_posts.campaignId, campaignId));
    await notifySocialCampaignResult(campaignId, "failed");
    throw new OrderError(409, "Listing is no longer eligible for Priority Boost");
  }
  if (eligibility.cycleId && eligibility.cycleId !== campaign.listingCycleId) {
    await db.update(seller_social_campaigns).set({ listingCycleId: eligibility.cycleId })
      .where(eq(seller_social_campaigns.id, campaignId));
  }

  const apiBase = process.env.SOCIAL_PUBLIC_API_URL?.trim().replace(/\/$/, "");
  const isDev = process.env.NODE_ENV !== "production" || apiBase?.includes("localhost") || apiBase?.includes("127.0.0.1");
  if (!apiBase?.startsWith("https://") && !isDev) throw new OrderError(503, "Social posting needs a public HTTPS API address");
  const posts = await db.select({ platform: seller_social_campaign_posts.platform, status: seller_social_campaign_posts.status })
    .from(seller_social_campaign_posts).where(eq(seller_social_campaign_posts.campaignId, campaignId));
  const targets = posts.filter((post) => post.status === "queued" && (post.platform === "facebook" || post.platform === "instagram"))
    .map((post) => ({ platform: post.platform, text: campaign.posts[post.platform] ?? "" }));

  return {
    campaignId,
    product: { id: eligibility.productId, name: eligibility.productName, listingUrl: eligibility.listingUrl },
    imageUrl: `${apiBase}/integrations/media/social-products/${eligibility.productId}`,
    targets,
  };
}

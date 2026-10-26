import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_social_campaign_posts, seller_social_campaigns } from "../../../db/schema";
import { getPriorityPromotionEligibility } from "../../../utils/promotion-eligibility";
import { getSocialChannelAvailability } from "../../../utils/social-publishing";
import { OrderError } from "../../../utils/order-types";
import { publishFacebookPagePhoto } from "./integrations.social-publish-facebook";
import { publishInstagramPhoto } from "./integrations.social-publish-instagram";

type SupportedPlatform = "facebook" | "instagram";

async function refreshCampaignStatus(campaignId: string) {
  const posts = await db.select({ status: seller_social_campaign_posts.status })
    .from(seller_social_campaign_posts).where(eq(seller_social_campaign_posts.campaignId, campaignId));
  const done = posts.every((post) => post.status === "published" || post.status === "failed");
  const published = posts.filter((post) => post.status === "published").length;
  const failed = posts.filter((post) => post.status === "failed").length;
  const status = done
    ? published === posts.length ? "published" : failed === posts.length ? "failed" : "partial"
    : posts.some((post) => post.status === "processing") ? "processing" : "publishing";
  await db.update(seller_social_campaigns).set({
    status,
    completedAt: done ? new Date() : null,
    lastError: status === "failed" || status === "partial" ? "One or more channels need attention" : null,
    updatedAt: new Date(),
  }).where(eq(seller_social_campaigns.id, campaignId));
  return status;
}

export async function dispatchSocialCampaignPlatform(campaignId: string, platform: SupportedPlatform) {
  const [campaign] = await db.select().from(seller_social_campaigns)
    .where(eq(seller_social_campaigns.id, campaignId)).limit(1);
  if (!campaign) throw new OrderError(404, "Social campaign not found");
  if (!campaign.selectedPlatforms.includes(platform)) throw new OrderError(404, "Selected channel not found");

  const existing = await db.select({ status: seller_social_campaign_posts.status, postUrl: seller_social_campaign_posts.postUrl })
    .from(seller_social_campaign_posts).where(and(
      eq(seller_social_campaign_posts.campaignId, campaignId), eq(seller_social_campaign_posts.platform, platform),
    )).limit(1);
  if (!existing[0]) throw new OrderError(404, "Selected channel not found");
  if (existing[0].status === "published" || existing[0].status === "processing") {
    return { campaignId, platform, status: existing[0].status, postUrl: existing[0].postUrl };
  }
  if (existing[0].status !== "queued") throw new OrderError(409, "This channel is not queued for posting");

  const eligibility = await getPriorityPromotionEligibility(campaign.listingCycleId, { stage: "followup", allowActiveListing: true });
  if (!eligibility?.eligible || eligibility.sellerId !== campaign.sellerId) {
    await db.update(seller_social_campaign_posts).set({
      status: "failed", lastError: "Listing is no longer eligible", completedAt: new Date(), updatedAt: new Date(),
    }).where(and(
      eq(seller_social_campaign_posts.campaignId, campaignId),
      eq(seller_social_campaign_posts.status, "queued"),
    ));
    await refreshCampaignStatus(campaignId);
    throw new OrderError(409, eligibility?.reason ?? "Listing is no longer eligible for Priority Boost");
  }
  if (eligibility.cycleId && eligibility.cycleId !== campaign.listingCycleId) {
    await db.update(seller_social_campaigns).set({ listingCycleId: eligibility.cycleId })
      .where(eq(seller_social_campaigns.id, campaignId));
  }
  const channel = getSocialChannelAvailability().find((item) => item.platform === platform);
  if (!channel?.configured) throw new OrderError(503, `${channel?.label ?? "This channel"} is not configured`);
  const apiBase = process.env.SOCIAL_PUBLIC_API_URL?.trim().replace(/\/$/, "");
  const isDev = process.env.NODE_ENV !== "production" || apiBase?.includes("localhost") || apiBase?.includes("127.0.0.1");
  if (!apiBase?.startsWith("https://") && !isDev) throw new OrderError(503, "Social posting needs a public HTTPS API address");
  const text = campaign.posts[platform]?.trim();
  if (!text || [...text].length > channel.captionLimit) throw new OrderError(409, "The post text needs to be updated before publishing");

  const [claimed] = await db.update(seller_social_campaign_posts).set({
    status: "processing", updatedAt: new Date(), lastError: null,
  }).where(and(
    eq(seller_social_campaign_posts.campaignId, campaignId),
    eq(seller_social_campaign_posts.platform, platform),
    eq(seller_social_campaign_posts.status, "queued"),
  )).returning({ id: seller_social_campaign_posts.id });
  if (!claimed) return { campaignId, platform, status: "processing" as const };

  await db.update(seller_social_campaigns).set({ status: "publishing", updatedAt: new Date() })
    .where(eq(seller_social_campaigns.id, campaignId));
  const imageUrl = `${apiBase}/integrations/media/social-products/${eligibility.productId}`;
  try {
    const result = platform === "facebook"
      ? await publishFacebookPagePhoto(imageUrl, text)
      : await publishInstagramPhoto(imageUrl, text);
    await db.update(seller_social_campaign_posts).set({
      status: "published", platformPostId: result.postId, postUrl: result.postUrl ?? null,
      lastError: null, completedAt: new Date(), updatedAt: new Date(),
    }).where(eq(seller_social_campaign_posts.id, claimed.id));
  } catch (error) {
    const message = error instanceof OrderError && error.statusCode === 503
      ? error.message
      : `Could not publish to ${channel.label}`;
    await db.update(seller_social_campaign_posts).set({
      status: "failed", lastError: message, completedAt: new Date(), updatedAt: new Date(),
    }).where(eq(seller_social_campaign_posts.id, claimed.id));
    console.error("Official social channel publish failed", { campaignId, platform, message: error instanceof Error ? error.message : "unknown" });
  }
  const status = await refreshCampaignStatus(campaignId);
  const [finalPost] = await db.select({ status: seller_social_campaign_posts.status, postUrl: seller_social_campaign_posts.postUrl })
    .from(seller_social_campaign_posts).where(eq(seller_social_campaign_posts.id, claimed.id)).limit(1);
  return { campaignId, platform, status: finalPost.status, postUrl: finalPost.postUrl, campaignStatus: status };
}

import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_social_campaign_posts, seller_social_campaigns } from "../../../db/schema";
import { getPriorityPromotionEligibility } from "../../../utils/promotion-eligibility";
import { getSocialChannelAvailability } from "../../../utils/social-publishing";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { OrderError } from "../../../utils/order-types";
import type { SellerSocialCampaignPublishInput } from "../model/seller.social-campaigns";
import { dispatchSocialCampaign } from "./seller.social-campaign.dispatch";

export async function publishSellerSocialCampaign(sellerId: string, campaignId: string, input: SellerSocialCampaignPublishInput) {
  const [draft] = await db.select().from(seller_social_campaigns).where(and(
    eq(seller_social_campaigns.id, campaignId), eq(seller_social_campaigns.sellerId, sellerId),
  )).limit(1);
  if (!draft) throw new OrderError(404, "Boost Visibility draft not found");
  if (draft.status !== "draft") throw new OrderError(409, "This post has already been sent");
  if (!input.platforms.length || new Set(input.platforms).size !== input.platforms.length) {
    throw new OrderError(400, "Choose each Agrivive channel only once");
  }

  const channelMap = new Map(getSocialChannelAvailability().map((channel) => [channel.platform, channel]));
  const posts: Record<string, string> = {};
  for (const platform of input.platforms) {
    const channel = channelMap.get(platform);
    if (!channel?.configured) throw new OrderError(503, `${channel?.label ?? "This channel"} is not available yet`);
    const text = input.posts[platform]?.trim();
    if (!text || [...text].length > channel.captionLimit) {
      throw new OrderError(400, `Check the ${platform} post text`);
    }
    posts[platform] = text;
  }

  const eligibility = await getPriorityPromotionEligibility(draft.listingCycleId);
  if (!eligibility?.eligible || eligibility.sellerId !== sellerId) {
    throw new OrderError(409, eligibility?.reason ?? "This listing is no longer ready for Boost Visibility");
  }

  await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [claimed] = await tx.update(seller_social_campaigns).set({
      posts,
      selectedPlatforms: input.platforms,
      approvedAt: new Date(),
      status: "queued",
      lastError: null,
      updatedAt: new Date(),
    }).where(and(
      eq(seller_social_campaigns.id, campaignId),
      eq(seller_social_campaigns.sellerId, sellerId),
      eq(seller_social_campaigns.status, "draft"),
    )).returning({ id: seller_social_campaigns.id });
    if (!claimed) throw new OrderError(409, "This post has already been sent");
    await tx.insert(seller_social_campaign_posts).values(input.platforms.map((platform) => ({
      campaignId,
      platform,
      status: "queued" as const,
    })));
  });

  try {
    await dispatchSocialCampaign(campaignId);
  } catch (error) {
    await db.transaction(async (tx) => {
      await tx.delete(seller_social_campaign_posts).where(eq(seller_social_campaign_posts.campaignId, campaignId));
      await tx.update(seller_social_campaigns).set({
        status: "draft", selectedPlatforms: [], approvedAt: null,
        lastError: null, updatedAt: new Date(),
      }).where(eq(seller_social_campaigns.id, campaignId));
    });
    console.error("Could not start official-channel publishing", { campaignId, message: error instanceof Error ? error.message : "unknown" });
    if (error instanceof OrderError) throw error;
    throw new OrderError(502, "Could not start posting. Your draft is saved.");
  }

  return { campaignId, status: "queued" as const };
}

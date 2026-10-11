import { and, asc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_social_campaign_posts, seller_social_campaigns, sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { OrderError } from "../../../utils/order-types";
import { getProductImageDisplayUrl } from "../../../utils/product-image";

export async function readSellerSocialCampaign(sellerId: string, campaignId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [campaign] = await tx.select({
      id: seller_social_campaigns.id,
      productName: sellers_product.productName,
      sourceImageUrl: sellers_product.imagUrl,
      status: seller_social_campaigns.status,
      posts: seller_social_campaigns.posts,
      lastError: seller_social_campaigns.lastError,
      createdAt: seller_social_campaigns.createdAt,
    }).from(seller_social_campaigns)
      .innerJoin(sellers_product, eq(sellers_product.id, seller_social_campaigns.productId))
      .where(and(eq(seller_social_campaigns.id, campaignId), eq(seller_social_campaigns.sellerId, sellerId))).limit(1);
    if (!campaign) throw new OrderError(404, "Boost Visibility draft not found");
    const posts = await tx.select({
      platform: seller_social_campaign_posts.platform,
      status: seller_social_campaign_posts.status,
      postUrl: seller_social_campaign_posts.postUrl,
      lastError: seller_social_campaign_posts.lastError,
    }).from(seller_social_campaign_posts).where(eq(seller_social_campaign_posts.campaignId, campaignId))
      .orderBy(asc(seller_social_campaign_posts.platform));
    return {
      id: campaign.id,
      productName: campaign.productName,
      imageUrl: campaign.sourceImageUrl ? await getProductImageDisplayUrl(campaign.sourceImageUrl, sellerId) : null,
      status: campaign.status,
      posts: campaign.posts,
      lastError: campaign.lastError,
      createdAt: campaign.createdAt,
      results: posts,
    };
  });
}

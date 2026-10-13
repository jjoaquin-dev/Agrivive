import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "../../../db";
import { listing_cycles, seller_social_campaigns, sellers_product } from "../../../db/schema";
import { getPriorityPromotionEligibility } from "../../../utils/promotion-eligibility";
import { generateSocialPromotionPosts } from "../../../utils/social-promotion-content";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { OrderError } from "../../../utils/order-types";
import { getProductImageDisplayUrl, validateProductImageReference } from "../../../utils/product-image";

export async function createSellerSocialCampaignDraft(sellerId: string, productId: string) {
  await db.transaction((tx) => requireVerifiedSeller(tx, sellerId));
  const [cycle] = await db.select({ id: listing_cycles.id }).from(listing_cycles)
    .innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId))
    .where(and(eq(listing_cycles.productId, productId), eq(sellers_product.userId, sellerId), lte(listing_cycles.startedAt, new Date())))
    .orderBy(desc(listing_cycles.startedAt)).limit(1);
  if (!cycle) throw new OrderError(404, "This listing is not ready for Boost Visibility");
  const eligibility = await getPriorityPromotionEligibility(cycle.id);
  if (!eligibility?.eligible || eligibility.sellerId !== sellerId) {
    throw new OrderError(409, eligibility?.reason ?? "This listing is not ready for Boost Visibility");
  }
  const [product] = await db.select({ imageUrl: sellers_product.imagUrl }).from(sellers_product)
    .where(and(eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId))).limit(1);
  if (!product?.imageUrl) throw new OrderError(409, "Add a product photo before posting");
  try { validateProductImageReference(product.imageUrl, sellerId); }
  catch { throw new OrderError(409, "Upload the product photo to Agrivive before posting"); }
  const image = new URL(product.imageUrl);
  const bucket = process.env.AWS_S3_BUCKET_NAME?.trim();
  const region = process.env.AWS_REGION || "ap-southeast-1";
  if (!bucket || image.hostname !== `${bucket}.s3.${region}.amazonaws.com`) {
    throw new OrderError(409, "Upload the product photo to Agrivive before posting");
  }
  const posts = await generateSocialPromotionPosts({
    productName: eligibility.productName,
    productType: eligibility.productType,
    shopName: eligibility.shopName,
    listingUrl: eligibility.listingUrl,
  });
  const [campaign] = await db.insert(seller_social_campaigns).values({
    sellerId,
    productId: eligibility.productId,
    listingCycleId: cycle.id,
    posts,
  }).returning({ id: seller_social_campaigns.id, status: seller_social_campaigns.status });
  return {
    campaignId: campaign.id,
    status: campaign.status,
    productId: eligibility.productId,
    productName: eligibility.productName,
    productUrl: eligibility.listingUrl,
    imageUrl: await getProductImageDisplayUrl(product.imageUrl, sellerId),
    posts,
  };
}

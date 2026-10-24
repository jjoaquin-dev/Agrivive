import { and, desc, eq, inArray, lte } from "drizzle-orm";
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

  const [product] = await db.select({
    imageUrl: sellers_product.imagUrl,
    priceReductionPeriodsApplied: sellers_product.priceReductionPeriodsApplied,
  }).from(sellers_product)
    .where(and(eq(sellers_product.id, productId), eq(sellers_product.userId, sellerId))).limit(1);
  if (!product?.imageUrl) throw new OrderError(409, "Add a product photo before posting");

  const existingPublished = await db.select({
    id: seller_social_campaigns.id,
    status: seller_social_campaigns.status,
  }).from(seller_social_campaigns)
    .where(and(
      eq(seller_social_campaigns.productId, productId),
      eq(seller_social_campaigns.listingCycleId, cycle.id),
      inArray(seller_social_campaigns.status, ["published", "queued", "publishing", "processing"]),
    ))
    .orderBy(desc(seller_social_campaigns.createdAt));

  const maxAllowedPosts = (product.priceReductionPeriodsApplied ?? 0) + 1;
  if (existingPublished.length >= maxAllowedPosts) {
    const latest = existingPublished[0];
    return {
      alreadyPublished: true,
      campaignId: latest.id,
      status: latest.status,
      productId,
      productName: "",
      productUrl: "",
      imageUrl: await getProductImageDisplayUrl(product.imageUrl, sellerId),
      posts: {},
      message: "This listing has already been posted. It can be posted again after its scheduled 12-hour price reduction.",
    };
  }

  const eligibility = await getPriorityPromotionEligibility(cycle.id);
  if (!eligibility || eligibility.sellerId !== sellerId) {
    throw new OrderError(404, "This listing is not ready for Boost Visibility");
  }
  if (!("productName" in eligibility) || !eligibility.eligible) {
    throw new OrderError(409, eligibility.reason ?? "This listing is not ready for Boost Visibility");
  }

  try { validateProductImageReference(product.imageUrl, sellerId); }
  catch { throw new OrderError(409, "Upload the product photo to Agrivive before posting"); }
  const image = new URL(product.imageUrl);
  const bucket = process.env.AWS_S3_BUCKET_NAME?.trim();
  const region = process.env.AWS_REGION || "ap-southeast-1";
  if (!bucket || image.hostname !== `${bucket}.s3.${region}.amazonaws.com`) {
    throw new OrderError(409, "Upload the product photo to Agrivive before posting");
  }

  const [existingDraft] = await db.select().from(seller_social_campaigns).where(and(
    eq(seller_social_campaigns.productId, productId),
    eq(seller_social_campaigns.listingCycleId, cycle.id),
    eq(seller_social_campaigns.status, "draft"),
  )).limit(1);

  const posts = await generateSocialPromotionPosts({
    productName: eligibility.productName,
    productType: eligibility.productType,
    shopName: eligibility.shopName,
    listingUrl: eligibility.listingUrl,
    price: eligibility.price,
    unit: eligibility.unit,
  });

  if (existingDraft) {
    await db.update(seller_social_campaigns).set({ posts, updatedAt: new Date() })
      .where(eq(seller_social_campaigns.id, existingDraft.id));
    return {
      campaignId: existingDraft.id,
      status: existingDraft.status,
      productId: eligibility.productId,
      productName: eligibility.productName,
      productUrl: eligibility.listingUrl,
      imageUrl: await getProductImageDisplayUrl(product.imageUrl, sellerId),
      posts,
    };
  }

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

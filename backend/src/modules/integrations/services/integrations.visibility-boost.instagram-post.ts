import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import type { VisibilityBoostFacebookPostBody } from "../model/integrations.visibility-boost";
import { boostCaptionText } from "./integrations.visibility-boost.caption";
import { getVisibilityBoostContext } from "./integrations.visibility-boost.context";
import { claimInstagramPost } from "./integrations.visibility-boost.instagram-claim";
import { finishInstagramPost } from "./integrations.visibility-boost.instagram-finish";
import { publishInstagramPhoto } from "./integrations.social-publish-instagram";

/** Posts one Boost photo to the Agrivive Instagram account. The result is kept apart from Facebook's. */
export async function postVisibilityBoostToInstagram(boostId: string, body: VisibilityBoostFacebookPostBody) {
  const context = await getVisibilityBoostContext(boostId);
  const [boost] = await db.select({ createdAt: seller_visibility_boosts.createdAt })
    .from(seller_visibility_boosts).where(eq(seller_visibility_boosts.id, boostId)).limit(1);
  if (!boost) throw new OrderError(404, "Visibility boost not found");

  const price = context.product.price.toFixed(2);
  const text = boostCaptionText(context, body.postType, body.caption, context.previousPrice);
  // Instagram captions have no clickable links, so the address is written out for buyers to type.
  const caption = `${text}\n\nFind it on Agrivive: ${context.product.listingUrl}`;

  const claim = await claimInstagramPost({ productId: context.product.id, postType: body.postType, price, since: boost.createdAt });
  if (claim.saved) {
    return { posted: false, alreadyPosted: true, instagramPostId: claim.saved.instagramPostId, postUrl: claim.saved.postUrl };
  }

  let result: Awaited<ReturnType<typeof publishInstagramPhoto>>;
  try {
    result = await publishInstagramPhoto(context.product.imageUrl, caption);
  } catch (error) {
    await finishInstagramPost(claim.logId, { status: "failed" })
      .catch((logError) => console.error("Failed to store instagram post log", logError));
    throw error;
  }
  // If saving fails here the row stays "pending", so a retry stops instead of posting twice.
  await finishInstagramPost(claim.logId, { status: "success", instagramPostId: result.postId, postUrl: result.postUrl });
  return { posted: true, alreadyPosted: false, instagramPostId: result.postId, postUrl: result.postUrl };
}

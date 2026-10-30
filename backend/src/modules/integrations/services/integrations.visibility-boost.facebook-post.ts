import { and, eq, gte } from "drizzle-orm";
import { db } from "../../../db";
import { fb_post_logs, seller_visibility_boosts } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { createFacebookPostLog } from "./integrations.fb-logs";
import { getVisibilityBoostContext } from "./integrations.visibility-boost.context";
import { publishFacebookPagePhoto } from "./integrations.social-publish-facebook";

function mentionsPrice(caption: string, price: string) {
  return [price, String(Number(price))].some((form) =>
    new RegExp(`₱\\s?${form.replace(".", "\\.")}(?!\\d|\\.\\d)`).test(caption));
}

function templateCaption(
  context: Awaited<ReturnType<typeof getVisibilityBoostContext>>,
  price: string,
) {
  const per = context.product.unit ? ` per ${context.product.unit}` : "";
  if (context.reason === "initial") {
    return `Fresh ${context.product.name} is now available at ₱${price}${per} from ${context.seller.shopName}!`;
  }
  const was = context.previousPrice ? ` (was ₱${context.previousPrice.toFixed(2)})` : "";
  return `Price drop! ${context.product.name} is now ₱${price}${per}${was} at ${context.seller.shopName}. Get yours before it sells out!`;
}

export async function postVisibilityBoostToFacebook(boostId: string, rawCaption: string) {
  // Re-checks the boost, the seller and the listing before anything is posted.
  const context = await getVisibilityBoostContext(boostId);
  const postType = context.reason === "initial" ? "first_post" : "second_post";
  const productId = context.product.id;
  const [boost] = await db.select({ createdAt: seller_visibility_boosts.createdAt })
    .from(seller_visibility_boosts).where(eq(seller_visibility_boosts.id, boostId)).limit(1);
  if (!boost) throw new OrderError(404, "Visibility boost not found");

  // A repeated delivery of the same boost must not post twice.
  const [existing] = await db.select({ facebookPostId: fb_post_logs.facebookPostId }).from(fb_post_logs).where(and(
    eq(fb_post_logs.productId, productId),
    eq(fb_post_logs.postType, postType),
    eq(fb_post_logs.status, "success"),
    gte(fb_post_logs.postedAt, boost.createdAt),
  )).limit(1);
  if (existing) return { posted: false, alreadyPosted: true, facebookPostId: existing.facebookPostId };

  // The backend owns the price and the link: drop any link the model wrote and add the right one.
  const price = context.product.price.toFixed(2);
  const written = rawCaption.replace(/https?:\/\/\S+/g, "").replace(/[ \t]+\n/g, "\n").trim();
  const text = written && mentionsPrice(written, price) ? written : templateCaption(context, price);
  const campaign = context.reason === "initial" ? "boost" : "price_drop";
  const caption = `${text}\n\nOrder here: ${context.product.listingUrl}` +
    `?utm_source=facebook&utm_medium=social&utm_campaign=${campaign}`;

  try {
    const result = await publishFacebookPagePhoto(context.product.imageUrl, caption);
    await createFacebookPostLog({ productId, postType, facebookPostId: result.postId, price, status: "success" });
    return { posted: true, alreadyPosted: false, facebookPostId: result.postId, postUrl: result.postUrl };
  } catch (error) {
    await createFacebookPostLog({ productId, postType, price, status: "failed" })
      .catch((logError) => console.error("Failed to store facebook post log", logError));
    if (error instanceof OrderError) throw error;
    throw new OrderError(502, "Facebook could not publish this post");
  }
}

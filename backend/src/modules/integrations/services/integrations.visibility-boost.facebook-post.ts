import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "../../../db";
import { fb_post_logs, seller_visibility_boosts } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import type { VisibilityBoostFacebookPostBody } from "../model/integrations.visibility-boost";
import { claimFacebookPost } from "./integrations.visibility-boost.post-claim";
import { finishFacebookPost } from "./integrations.visibility-boost.post-finish";
import { scheduleBoostFollowUp } from "./integrations.visibility-boost.follow-up.schedule";
import { notifyBoostFailed } from "./integrations.visibility-boost.notify-failed";
import { rearmBoostFollowUp } from "./integrations.visibility-boost.follow-up.rearm";
import { notifyBoostPriceLowered } from "./integrations.visibility-boost.notify-price-lowered";
import { notifyBoostStarted } from "./integrations.visibility-boost.notify-started";
import { getVisibilityBoostContext } from "./integrations.visibility-boost.context";
import { boostCaptionText } from "./integrations.visibility-boost.caption";
import { publishFacebookPagePhoto } from "./integrations.social-publish-facebook";

export async function postVisibilityBoostToFacebook(boostId: string, body: VisibilityBoostFacebookPostBody) {
  // Re-checks the boost, the seller and the listing before anything is posted.
  const context = await getVisibilityBoostContext(boostId);
  const productId = context.product.id;
  const [boost] = await db.select({ createdAt: seller_visibility_boosts.createdAt })
    .from(seller_visibility_boosts).where(eq(seller_visibility_boosts.id, boostId)).limit(1);
  if (!boost) throw new OrderError(404, "Visibility boost not found");

  // The newest saved post of this boost, first or second. Each 6-hour round announces a price lower than this one.
  const findLastPost = async () => {
    const [row] = await db.select().from(fb_post_logs).where(and(
      eq(fb_post_logs.productId, productId),
      eq(fb_post_logs.status, "success"),
      gte(fb_post_logs.postedAt, boost.createdAt),
    )).orderBy(desc(fb_post_logs.postedAt)).limit(1);
    return row;
  };

  let previous: number | null = null;
  let since = boost.createdAt;
  if (body.postType === "second_post") {
    const last = await findLastPost();
    if (!last) throw new OrderError(409, "The first post has not been published yet");
    // The price has not dropped since the last post, so this round was already posted (a repeated call).
    if (context.product.price >= Number(last.price)) {
      return { posted: false, alreadyPosted: true, postType: body.postType, facebookPostId: last.facebookPostId };
    }
    previous = Number(last.price);
    since = new Date(last.postedAt.getTime() + 1);
  }

  // The backend owns the price and the link: drop any link the model wrote and add the right one.
  const price = context.product.price.toFixed(2);
  const text = boostCaptionText(context, body.postType, body.caption, previous);
  const campaign = body.postType === "first_post" ? "boost" : "price_drop";
  const caption = `${text}\n\nOrder here: ${context.product.listingUrl}` +
    `?utm_source=facebook&utm_medium=social&utm_campaign=${campaign}`;

  // A repeated delivery of the same boost returns the saved post instead of posting twice.
  const claim = await claimFacebookPost({ productId, postType: body.postType, price, since });
  if (claim.saved) {
    if (body.postType === "first_post") await scheduleBoostFollowUp(boostId, claim.saved.postedAt);
    return { posted: false, alreadyPosted: true, postType: body.postType, facebookPostId: claim.saved.facebookPostId };
  }

  let result: Awaited<ReturnType<typeof publishFacebookPagePhoto>>;
  try {
    result = await publishFacebookPagePhoto(context.product.imageUrl, caption);
  } catch (error) {
    await finishFacebookPost(claim.logId, { status: "failed" })
      .catch((logError) => console.error("Failed to store facebook post log", logError));
    await notifyBoostFailed(boostId, body.postType);
    if (error instanceof OrderError) throw error;
    throw new OrderError(502, "Facebook could not publish this post");
  }

  // If saving fails here the row stays "pending", so a retry stops instead of posting twice.
  const log = await finishFacebookPost(claim.logId, { status: "success", facebookPostId: result.postId, caption });
  if (body.postType === "first_post") {
    await scheduleBoostFollowUp(boostId, log.postedAt);
    await notifyBoostStarted(boostId);
  } else {
    await notifyBoostPriceLowered(boostId);
    await rearmBoostFollowUp(boostId);
  }
  return {
    posted: true, alreadyPosted: false, postType: body.postType,
    facebookPostId: result.postId, postUrl: result.postUrl,
  };
}

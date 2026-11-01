import { OrderError } from "../../../utils/order-types";
import type { VisibilityBoostFacebookPostBody } from "../model/integrations.visibility-boost";
import { postVisibilityBoostToFacebook } from "./integrations.visibility-boost.facebook-post";
import { postVisibilityBoostToInstagram } from "./integrations.visibility-boost.instagram-post";

/**
 * One Boost post goes to Facebook and Instagram. Each one has its own result:
 * a Facebook failure does not stop Instagram, and an Instagram failure never fails Facebook.
 * A 409 from Facebook (still sending, too soon, first post missing) means this call should not post at all.
 */
export async function postVisibilityBoostToSocial(boostId: string, body: VisibilityBoostFacebookPostBody) {
  let facebook: Awaited<ReturnType<typeof postVisibilityBoostToFacebook>> | null = null;
  let facebookError: unknown = null;
  try {
    facebook = await postVisibilityBoostToFacebook(boostId, body);
  } catch (error) {
    facebookError = error;
    if (error instanceof OrderError && error.statusCode < 500 && error.statusCode !== 502) throw error;
  }

  let instagram: { status: "posted" | "failed"; message?: string } & Record<string, unknown>;
  try {
    instagram = { status: "posted", ...await postVisibilityBoostToInstagram(boostId, body) };
  } catch (error) {
    const message = error instanceof OrderError ? error.message : "Instagram could not publish this post";
    if (!(error instanceof OrderError)) console.error("Visibility boost Instagram post failed", error);
    instagram = { status: "failed", message };
  }

  // Facebook's own answer keeps its old shape and status code. Instagram's result rides along.
  if (facebookError) throw facebookError;
  return { ...facebook, instagram };
}

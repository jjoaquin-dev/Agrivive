import { and, desc, eq, gte } from "drizzle-orm";
import { fb_post_logs, instagram_post_logs } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";
import { boostResendAfterMs } from "./seller.visibility-boost.used";

export type BoostChannelStatus = "waiting" | "posting" | "posted" | "failed";
export type BoostChannel = { status: BoostChannelStatus; postUrl: string | null };
export type BoostChannels = { facebook: BoostChannel; instagram: BoostChannel };

type Row = { status: string; postedAt: Date };

function channelOf(row: Row | undefined, stuck: boolean, postUrl: string | null): BoostChannel {
  if (!row) return { status: stuck ? "failed" : "waiting", postUrl: null };
  if (row.status === "success") return { status: "posted", postUrl };
  if (row.status === "failed") return { status: "failed", postUrl: null };
  // A pending row that never finished may or may not have reached the platform, so it is not reported as posted.
  return { status: Date.now() - row.postedAt.getTime() > boostResendAfterMs ? "failed" : "posting", postUrl: null };
}

/** What Facebook and Instagram each answered for this boost's own post. Each one is read from its own log. */
export async function readBoostChannels(
  tx: OrderTransaction,
  boost: { productId: string; reason: "initial" | "price_reduction"; createdAt: Date; sentAt: Date | null },
): Promise<BoostChannels> {
  // Boosts made before the price change kind was removed posted the second post.
  const postType = boost.reason === "initial" ? "first_post" : "second_post";
  const [facebook] = await tx.select().from(fb_post_logs).where(and(
    eq(fb_post_logs.productId, boost.productId), eq(fb_post_logs.postType, postType), gte(fb_post_logs.postedAt, boost.createdAt),
  )).orderBy(desc(fb_post_logs.postedAt)).limit(1);
  const [instagram] = await tx.select().from(instagram_post_logs).where(and(
    eq(instagram_post_logs.productId, boost.productId), eq(instagram_post_logs.postType, postType), gte(instagram_post_logs.postedAt, boost.createdAt),
  )).orderBy(desc(instagram_post_logs.postedAt)).limit(1);

  // No row long after n8n accepted the boost means that platform never got a post, even if the other one did.
  const stuck = boost.sentAt !== null && Date.now() - boost.sentAt.getTime() > boostResendAfterMs;
  return {
    facebook: channelOf(facebook, stuck, facebook?.facebookPostId ? `https://www.facebook.com/${facebook.facebookPostId}` : null),
    instagram: channelOf(instagram, stuck, instagram?.postUrl ?? null),
  };
}

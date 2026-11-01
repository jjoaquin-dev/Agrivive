import { and, eq, gte, inArray } from "drizzle-orm";
import { fb_post_logs, seller_visibility_boosts } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";

/** A boost n8n accepted but never posted can be sent again after this long. */
export const boostResendAfterMs = 5 * 60_000;

/** True when the boost reached n8n a while ago but no post (or post in progress) was saved for it. */
export async function isBoostStuck(
  tx: OrderTransaction,
  boost: { productId: string; createdAt: Date; sentAt: Date | null },
) {
  if (!boost.sentAt || Date.now() - boost.sentAt.getTime() <= boostResendAfterMs) return false;
  const [post] = await tx.select({ id: fb_post_logs.id }).from(fb_post_logs).where(and(
    eq(fb_post_logs.productId, boost.productId),
    eq(fb_post_logs.postType, "first_post"),
    inArray(fb_post_logs.status, ["success", "pending"]),
    gte(fb_post_logs.postedAt, boost.createdAt),
  )).limit(1);
  return !post;
}

/** Boosts in this listing cycle that count against the limit. Failed, dismissed, prompt and stuck rows do not. */
export async function countUsedBoosts(tx: OrderTransaction, productId: string, listingCycleId: string) {
  const rows = await tx.select({
    productId: seller_visibility_boosts.productId,
    reason: seller_visibility_boosts.reason,
    status: seller_visibility_boosts.status,
    createdAt: seller_visibility_boosts.createdAt,
    sentAt: seller_visibility_boosts.sentAt,
  }).from(seller_visibility_boosts).where(and(
    eq(seller_visibility_boosts.productId, productId),
    eq(seller_visibility_boosts.listingCycleId, listingCycleId),
    inArray(seller_visibility_boosts.status, ["queued", "sent"]),
  ));
  let used = 0;
  for (const row of rows) {
    if (row.status === "sent" && await isBoostStuck(tx, row)) continue;
    used++;
  }
  return used;
}

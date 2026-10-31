import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "../../db";
import { fb_post_logs } from "../../db/schema";

/** Hours between two price drop posts for the same product. */
export const priceDropPostGapHours = 3;

/**
 * When the product may get another price drop post, or null if it may now.
 * `before` ignores posts made at or after that time (a boost's own post).
 */
export async function getPriceDropPostCooldownEnd(
  executor: Pick<typeof db, "select">,
  productId: string,
  before?: Date,
) {
  const [last] = await executor.select({ postedAt: fb_post_logs.postedAt }).from(fb_post_logs).where(and(
    eq(fb_post_logs.productId, productId),
    eq(fb_post_logs.postType, "second_post"),
    eq(fb_post_logs.status, "success"),
    before ? lt(fb_post_logs.postedAt, before) : undefined,
  )).orderBy(desc(fb_post_logs.postedAt)).limit(1);
  if (!last) return null;
  const end = new Date(last.postedAt.getTime() + priceDropPostGapHours * 3_600_000);
  return end.getTime() > Date.now() ? end : null;
}

import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "../../db";
import { fb_post_logs } from "../../db/schema";

/** Hours between two price drop posts for the same product. */
export const priceDropPostGapHours = 3;

/** Hours between two first posts for the same product. */
export const firstPostGapHours = 3;

type Executor = Pick<typeof db, "select">;

async function getPostCooldownEnd(
  executor: Executor,
  productId: string,
  postType: "first_post" | "second_post",
  gapHours: number,
  before?: Date,
) {
  const [last] = await executor.select({ postedAt: fb_post_logs.postedAt }).from(fb_post_logs).where(and(
    eq(fb_post_logs.productId, productId),
    eq(fb_post_logs.postType, postType),
    eq(fb_post_logs.status, "success"),
    before ? lt(fb_post_logs.postedAt, before) : undefined,
  )).orderBy(desc(fb_post_logs.postedAt)).limit(1);
  if (!last) return null;
  const end = new Date(last.postedAt.getTime() + gapHours * 3_600_000);
  return end.getTime() > Date.now() ? end : null;
}

/** When the product may get another first post, or null if it may now. */
export const getFirstPostCooldownEnd = (executor: Executor, productId: string, before?: Date) =>
  getPostCooldownEnd(executor, productId, "first_post", firstPostGapHours, before);

/** When the product may get another price drop post, or null if it may now. */
export const getPriceDropPostCooldownEnd = (executor: Executor, productId: string, before?: Date) =>
  getPostCooldownEnd(executor, productId, "second_post", priceDropPostGapHours, before);

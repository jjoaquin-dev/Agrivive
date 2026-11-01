import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "../../../db";
import { fb_post_logs } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

const stillSendingMs = 5 * 60_000;

/**
 * Saves a "pending" row before anything is sent to Facebook.
 * - A saved post since `since` is returned, so a retry never posts twice.
 * - A pending row means an earlier try never finished. Facebook may or may not have the post,
 *   so we stop and ask for a manual check instead of posting again.
 */
export async function claimFacebookPost(input: {
  productId: string;
  postType: "first_post" | "second_post";
  price: string;
  since: Date;
}) {
  return db.transaction(async (tx) => {
    // One claim at a time per product and post type.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`fb-post:${input.productId}:${input.postType}`}))`);
    const rows = await tx.select().from(fb_post_logs).where(and(
      eq(fb_post_logs.productId, input.productId),
      eq(fb_post_logs.postType, input.postType),
      inArray(fb_post_logs.status, ["success", "pending"]),
      gte(fb_post_logs.postedAt, input.since),
    )).orderBy(desc(fb_post_logs.postedAt));

    const saved = rows.find((row) => row.status === "success");
    if (saved) return { saved, logId: null };

    const pending = rows[0];
    if (pending) {
      const sending = Date.now() - pending.postedAt.getTime() < stillSendingMs;
      throw new OrderError(409, sending
        ? "This post is still being sent"
        : "An earlier try may have reached Facebook. Check the Page before trying again");
    }

    const [log] = await tx.insert(fb_post_logs).values({
      productId: input.productId,
      postType: input.postType,
      price: input.price,
      status: "pending",
    }).returning({ id: fb_post_logs.id });
    return { saved: null, logId: log.id };
  });
}

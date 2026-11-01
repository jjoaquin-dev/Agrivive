import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "../../../db";
import { instagram_post_logs } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";

const stillSendingMs = 5 * 60_000;

/**
 * Saves a "pending" row before anything is sent to Instagram, like the Facebook claim.
 * One post per product, post type and price since the boost began, so a repeated call never posts twice.
 */
export async function claimInstagramPost(input: {
  productId: string;
  postType: "first_post" | "second_post";
  price: string;
  since: Date;
}) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`ig-post:${input.productId}:${input.postType}`}))`);
    const rows = await tx.select().from(instagram_post_logs).where(and(
      eq(instagram_post_logs.productId, input.productId),
      eq(instagram_post_logs.postType, input.postType),
      eq(instagram_post_logs.price, input.price),
      inArray(instagram_post_logs.status, ["success", "pending"]),
      gte(instagram_post_logs.postedAt, input.since),
    )).orderBy(desc(instagram_post_logs.postedAt));

    const saved = rows.find((row) => row.status === "success");
    if (saved) return { saved, logId: null };

    const pending = rows[0];
    if (pending) {
      const sending = Date.now() - pending.postedAt.getTime() < stillSendingMs;
      throw new OrderError(409, sending
        ? "This post is still being sent"
        : "An earlier try may have reached Instagram. Check the account before trying again");
    }

    const [log] = await tx.insert(instagram_post_logs).values({
      productId: input.productId,
      postType: input.postType,
      price: input.price,
      status: "pending",
    }).returning({ id: instagram_post_logs.id });
    return { saved: null, logId: log.id };
  });
}

import { and, asc, eq, gte, inArray } from "drizzle-orm";
import { fb_post_logs } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";
import { isBoostStuck } from "./seller.visibility-boost.used";

export type BoostState =
  | "posting" | "posted" | "running" | "finished" | "not_posted" | "failed" | "needs_choice" | "dismissed";

type BoostRow = {
  id: string;
  productId: string;
  reason: "initial" | "price_reduction";
  status: "prompt" | "queued" | "sent" | "failed" | "dismissed";
  createdAt: Date;
  sentAt: Date | null;
  followUpDueAt: Date | null;
};

/**
 * Plain progress for each boost: what state it is in, the Facebook posts saved for it,
 * how many price drop rounds are done, and when the next one is due.
 */
export async function readBoostProgress(tx: OrderTransaction, rows: BoostRow[]) {
  const progress = new Map<string, {
    state: BoostState;
    roundsDone: number;
    nextDropAt: string | null;
    posts: { type: "first_post" | "second_post"; price: number; postedAt: string; postUrl: string | null }[];
  }>();
  if (rows.length === 0) return progress;

  const oldest = new Date(Math.min(...rows.map((row) => row.createdAt.getTime())));
  const logs = await tx.select().from(fb_post_logs).where(and(
    inArray(fb_post_logs.productId, [...new Set(rows.map((row) => row.productId))]),
    eq(fb_post_logs.status, "success"),
    gte(fb_post_logs.postedAt, oldest),
  )).orderBy(asc(fb_post_logs.postedAt));

  for (const row of rows) {
    let own = logs.filter((log) => log.productId === row.productId && log.postedAt >= row.createdAt);
    // A seller's boost after a price drop owns one post: the first one after it was queued.
    if (row.reason === "price_reduction") own = own.slice(0, 1);
    const posts = own.map((log) => ({
      type: log.postType as "first_post" | "second_post",
      price: Number(log.price),
      postedAt: log.postedAt.toISOString(),
      postUrl: log.facebookPostId ? `https://www.facebook.com/${log.facebookPostId}` : null,
    }));

    let state: BoostState;
    if (row.status === "failed") state = "failed";
    else if (row.status === "prompt") state = "needs_choice";
    else if (row.status === "dismissed") state = "dismissed";
    else if (posts.length === 0) {
      state = row.status === "sent" && await isBoostStuck(tx, row) ? "not_posted" : "posting";
    } else if (row.reason === "price_reduction") state = "posted";
    else if (row.followUpDueAt) state = "running";
    else state = posts.length > 1 ? "finished" : "posted";

    const initial = row.reason === "initial";
    progress.set(row.id, {
      state,
      roundsDone: initial ? Math.max(0, posts.length - 1) : 0,
      nextDropAt: initial && state === "running" && row.followUpDueAt ? row.followUpDueAt.toISOString() : null,
      posts,
    });
  }
  return progress;
}

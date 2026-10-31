import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { instagram_post_logs } from "../../../db/schema";

/** Closes the pending row with what Instagram answered. */
export async function finishInstagramPost(
  logId: string,
  result: { status: "success"; instagramPostId: string; postUrl: string | null } | { status: "failed" },
) {
  const [log] = await db.update(instagram_post_logs).set({
    status: result.status,
    instagramPostId: result.status === "success" ? result.instagramPostId : null,
    postUrl: result.status === "success" ? result.postUrl : null,
    postedAt: new Date(),
  }).where(eq(instagram_post_logs.id, logId)).returning();
  return log;
}

import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { fb_post_logs } from "../../../db/schema";

/** Closes the pending row with what Facebook answered. */
export async function finishFacebookPost(
  logId: string,
  result: { status: "success"; facebookPostId: string } | { status: "failed" },
) {
  const [log] = await db.update(fb_post_logs).set({
    status: result.status,
    facebookPostId: result.status === "success" ? result.facebookPostId : null,
    postedAt: new Date(),
  }).where(eq(fb_post_logs.id, logId)).returning();
  return log;
}

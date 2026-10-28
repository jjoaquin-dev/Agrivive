import { db } from "../../../db";
import { fb_post_logs } from "../../../db/schema";

export async function createFacebookPostLog(input: {
  productId: string;
  postType: "first_post" | "second_post";
  facebookPostId?: string;
  price: string;
  status: "success" | "failed";
}) {
  const [log] = await db.insert(fb_post_logs).values({
    productId: input.productId,
    postType: input.postType,
    facebookPostId: input.facebookPostId ?? null,
    price: input.price,
    status: input.status,
    postedAt: new Date(),
  }).returning();
  return log;
}

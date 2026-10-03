import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { user } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { getAvatarDisplayUrl } from "../../../utils/s3-avatar";

export async function getBuyerProfile(userId: string) {
  const [account] = await db.select({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  }).from(user).where(eq(user.id, userId)).limit(1);

  if (!account) throw new OrderError(404, "Buyer profile not found");

  return {
    account: {
      ...account,
      image: await getAvatarDisplayUrl(account.image),
    },
  };
}

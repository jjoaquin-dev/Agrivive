import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { requireVerifiedSeller } from "../../../utils/seller-access";

export async function readSellerVisibilityBoostPrompt(sellerId: string, promptId: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);
    const [prompt] = await tx.update(seller_visibility_boosts).set({
      readAt: new Date(),
      updatedAt: new Date(),
    }).where(and(
      eq(seller_visibility_boosts.id, promptId),
      eq(seller_visibility_boosts.sellerId, sellerId),
      eq(seller_visibility_boosts.status, "prompt"),
    )).returning({ id: seller_visibility_boosts.id, readAt: seller_visibility_boosts.readAt });
    if (!prompt) throw new OrderError(404, "Boost prompt not found");
    return prompt;
  });
}

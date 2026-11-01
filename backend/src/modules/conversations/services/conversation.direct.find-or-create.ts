import { eq } from "drizzle-orm";
import { conversation_participants, conversations } from "../../../db/schema";
import type { OrderTransaction } from "../../../utils/order-types";

interface Input {
  buyerId: string;
  sellerId: string;
  contextType: "product" | "order" | "seller";
  productId?: string | null;
  orderId?: string | null;
}

/** One chat per buyer and seller. Reuses it and moves it to the newest context, or creates it with both people in it. */
export async function findOrCreateDirectConversation(tx: OrderTransaction, input: Input) {
  const contextKey = `direct:${input.buyerId}:${input.sellerId}`;
  const now = new Date();
  const [existing] = await tx.select().from(conversations).where(eq(conversations.contextKey, contextKey)).for("update").limit(1);

  if (existing) {
    const [updated] = await tx.update(conversations).set({
      contextType: input.contextType,
      productId: input.productId ?? existing.productId,
      orderId: input.orderId ?? existing.orderId,
      status: "open",
      lastMessageAt: now,
      updatedAt: now,
    }).where(eq(conversations.id, existing.id)).returning();
    return updated;
  }

  const [created] = await tx.insert(conversations).values({
    contextType: input.contextType,
    contextKey,
    buyerId: input.buyerId,
    sellerId: input.sellerId,
    productId: input.productId ?? undefined,
    orderId: input.orderId ?? undefined,
    lastMessageAt: now,
  }).returning();
  await tx.insert(conversation_participants).values([
    { conversationId: created.id, userId: input.buyerId },
    { conversationId: created.id, userId: input.sellerId },
  ]);
  return created;
}

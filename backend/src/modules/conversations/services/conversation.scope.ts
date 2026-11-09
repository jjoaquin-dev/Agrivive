import { eq, or } from "drizzle-orm";
import { conversations } from "../../../db/schema";

/** Which side of a chat the app is showing. The web app is the buyer side; the mobile app is the seller side. */
export type ConversationSide = "buyer" | "seller";

/** Limits conversations to the ones where this person is on that side. With no side, both sides count. */
export function conversationSideFilter(userId: string, side?: ConversationSide) {
  if (side === "buyer") return eq(conversations.buyerId, userId);
  if (side === "seller") return eq(conversations.sellerId, userId);
  return or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId));
}

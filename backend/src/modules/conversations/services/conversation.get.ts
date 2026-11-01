import { and, eq, or } from "drizzle-orm";
import { conversations } from "../../../db/schema";
import { ConversationError } from "./conversation.error";
import { buildConversationSelect } from "./conversation.select";
import { presentConversationRow } from "./conversation.present";

export async function getConversation(userId: string, conversationId: string) {
  const [row] = await buildConversationSelect(userId)
    .where(and(
      eq(conversations.id, conversationId),
      or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId)),
    ))
    .limit(1);
  if (!row) throw new ConversationError(404, "Conversation not found");
  return presentConversationRow(row);
}

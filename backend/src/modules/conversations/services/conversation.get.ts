import { and, eq } from "drizzle-orm";
import { conversations } from "../../../db/schema";
import { ConversationError } from "./conversation.error";
import { buildConversationSelect } from "./conversation.select";
import { presentConversationRow } from "./conversation.present";
import { conversationSideFilter, type ConversationSide } from "./conversation.scope";

export async function getConversation(userId: string, conversationId: string, side?: ConversationSide) {
  const [row] = await buildConversationSelect(userId)
    .where(and(
      eq(conversations.id, conversationId),
      conversationSideFilter(userId, side),
    ))
    .limit(1);
  if (!row) throw new ConversationError(404, "Conversation not found");
  return presentConversationRow(row);
}

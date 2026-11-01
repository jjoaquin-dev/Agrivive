import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { conversation_participants } from "../../../db/schema";
import { ConversationError } from "./conversation.error";

/** Archive, unarchive, block or unblock one conversation for one signed-in user. */
export async function setConversationParticipantState(
  userId: string,
  conversationId: string,
  change: { archivedAt: Date | null } | { blockedAt: Date | null },
) {
  const [member] = await db.select({ id: conversation_participants.id }).from(conversation_participants).where(and(
    eq(conversation_participants.conversationId, conversationId),
    eq(conversation_participants.userId, userId),
  )).limit(1);
  if (!member) throw new ConversationError(404, "Conversation not found");

  await db.update(conversation_participants).set(change).where(eq(conversation_participants.id, member.id));
  return { ok: true };
}

import { and, desc, eq, lt, or } from "drizzle-orm";
import { db } from "../../../db";
import { conversations } from "../../../db/schema";
import { buildConversationSelect } from "./conversation.select";
import { presentConversationRow } from "./conversation.present";

export async function listConversations(userId: string, limit = 50, cursor?: string) {
  let before;
  if (cursor) {
    const [anchor] = await db
      .select({ id: conversations.id, lastMessageAt: conversations.lastMessageAt })
      .from(conversations)
      .where(and(eq(conversations.id, cursor), or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId))))
      .limit(1);
    if (anchor) {
      before = or(
        lt(conversations.lastMessageAt, anchor.lastMessageAt),
        and(eq(conversations.lastMessageAt, anchor.lastMessageAt), lt(conversations.id, anchor.id)),
      );
    }
  }

  const rows = await buildConversationSelect(userId)
    .where(and(or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId)), before))
    .orderBy(desc(conversations.lastMessageAt), desc(conversations.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;

  const items = await Promise.all(page.map(presentConversationRow));

  return {
    items,
    nextCursor: hasMore && page.length > 0 ? page[page.length - 1].id : null,
  };
}

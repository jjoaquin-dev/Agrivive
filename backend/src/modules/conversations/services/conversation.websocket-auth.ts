import { auth } from "../../auth";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { conversations, user } from "../../../db/schema";
import { and, or } from "drizzle-orm";

export async function getConversationSocketUserId(request: Request) {
  const authSession = await auth.api.getSession({ headers: request.headers });
  if (!authSession) return null;

  const [account] = await db.select({ id: user.id, isActive: user.isActive, roles: user.role })
    .from(user).where(eq(user.id, authSession.user.id)).limit(1);
  if (!account?.isActive || !account.roles?.some((role) => role === "buyer" || role === "seller")) return null;
  return account.id;
}

export async function canAccessConversation(userId: string, conversationId: string) {
  const [conversation] = await db.select({ id: conversations.id }).from(conversations).where(and(
    eq(conversations.id, conversationId),
    or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId)),
  )).limit(1);
  return Boolean(conversation);
}

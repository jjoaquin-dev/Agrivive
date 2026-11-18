import { eq } from "drizzle-orm";
import { auth } from "../../modules/auth";
import { db } from "../../db";
import { user } from "../../db/schema";

/** The signed-in buyer or seller behind a socket request, or null for a visitor. Never throws. */
export async function readLiveSocketUserId(headers: Headers): Promise<string | null> {
  try {
    const authSession = await auth.api.getSession({ headers });
    if (!authSession) return null;
    const [account] = await db.select({ id: user.id, isActive: user.isActive, roles: user.role })
      .from(user).where(eq(user.id, authSession.user.id)).limit(1);
    if (!account?.isActive || !account.roles?.some((role) => role === "buyer" || role === "seller")) return null;
    return account.id;
  } catch {
    return null;
  }
}

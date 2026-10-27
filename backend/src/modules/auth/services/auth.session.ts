import Elysia from "elysia";
import { auth } from "..";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { user as users } from "../../../db/schema";
import { touchUserActivity } from "../../../utils/user-activity";

export type Rtype = "admin" | "buyer" | "seller" | "stakeholder";

interface CachedUserStatus {
  isActive: boolean;
  role: string[];
  email: string;
  cachedAt: number;
}

const userStatusCache = new Map<string, CachedUserStatus>();
const STATUS_CACHE_TTL_MS = 30_000;

export const sellerRoute = new Elysia({ name: "auth.session" });

export const sessionAuth = new Elysia()

  //get session and role
  .macro({
    role: (allowedRoles: Rtype[] = []) => ({
      async resolve({ request, status }) {
        const authSession = await auth.api.getSession({
          headers: request.headers,
        });

        if (!authSession) {
          return status(401);
        }

        const now = Date.now();
        let cached = userStatusCache.get(authSession.user.id);
        if (!cached || now - cached.cachedAt > STATUS_CACHE_TTL_MS) {
          const [current] = await db.select({ role: users.role, isActive: users.isActive, email: users.email })
            .from(users).where(eq(users.id, authSession.user.id)).limit(1);
          if (!current) return status(403);
          cached = {
            isActive: Boolean(current.isActive),
            role: current.role ?? [],
            email: current.email,
            cachedAt: now,
          };
          if (userStatusCache.size > 5_000) userStatusCache.clear();
          userStatusCache.set(authSession.user.id, cached);
        }

        if (!cached.isActive) return status(403);
        void touchUserActivity(authSession.user.id);
        const userRoles = [...(cached.role ?? [])];
        const stakeholderEmails = new Set((process.env.STAKEHOLDER_EMAILS ?? "")
          .split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
        if (stakeholderEmails.has(cached.email.toLowerCase()) && !userRoles.includes("stakeholder")) {
          userRoles.push("stakeholder");
        }

        const hasAllowedRole = userRoles.some((role) =>
          allowedRoles.includes(role as Rtype),
        );
        if (!hasAllowedRole) {
          return status(403);
        }

        return {
          user: { ...authSession.user, role: userRoles, isActive: cached.isActive },
          session: authSession.session,
        };
      },
    }),
  });

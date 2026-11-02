import Elysia from "elysia";
import { auth } from "..";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { user as users } from "../../../db/schema";
import { touchUserActivity } from "../../../utils/user-activity";
import { readAccountBlock } from "../../../utils/trust/read-account-block";
import { STATUS_CACHE_TTL_MS, userStatusCache } from "../../../utils/user-status-cache";

export type Rtype = "admin" | "buyer" | "seller" | "stakeholder";

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
          return status(401, { message: "Please sign in to continue." });
        }

        const now = Date.now();
        let cached = userStatusCache.get(authSession.user.id);
        if (!cached || now - cached.cachedAt > STATUS_CACHE_TTL_MS) {
          const [current] = await db
            .select({ role: users.role, isActive: users.isActive, email: users.email })
            .from(users)
            .where(eq(users.id, authSession.user.id))
            .limit(1);

          if (!current) {
            return status(403, { message: "Account not found or access denied." });
          }

          let isActive = Boolean(current.isActive);
          let blockReason: string | undefined;
          if (!isActive) {
            blockReason = (await readAccountBlock(authSession.user.id)) ?? undefined;
            if (!blockReason) isActive = true; // the pause had ended, so the account was opened again
          }

          cached = {
            isActive,
            role: current.role ?? [],
            email: current.email,
            blockReason,
            cachedAt: now,
          };
          if (userStatusCache.size > 5_000) userStatusCache.clear();
          userStatusCache.set(authSession.user.id, cached);
        }

        if (!cached.isActive) {
          return status(403, {
            message: cached.blockReason || "Your account is paused. Please restore your account to continue.",
          });
        }

        void touchUserActivity(authSession.user.id);
        const userRoles = [...(cached.role ?? [])];
        const stakeholderEmails = new Set(
          (process.env.STAKEHOLDER_EMAILS ?? "")
            .split(",")
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean),
        );
        if (stakeholderEmails.has(cached.email.toLowerCase()) && !userRoles.includes("stakeholder")) {
          userRoles.push("stakeholder");
        }

        const hasAllowedRole = userRoles.some((role) =>
          allowedRoles.includes(role as Rtype),
        );
        if (!hasAllowedRole) {
          const required = allowedRoles
            .map((r) => (r === "buyer" ? "buyer" : r === "seller" ? "seller" : r))
            .join(" or ");
          return status(403, {
            message: `You do not have permission to do that. This action requires a ${required} account.`,
          });
        }

        return {
          user: { ...authSession.user, role: userRoles, isActive: cached.isActive },
          session: authSession.session,
        };
      },
    }),
  });

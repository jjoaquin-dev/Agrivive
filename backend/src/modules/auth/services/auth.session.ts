import Elysia from "elysia";
import { auth } from "..";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { user as users } from "../../../db/schema";

export type Rtype = "admin" | "buyer" | "seller";

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

        const [current] = await db.select({ role: users.role, isActive: users.isActive })
          .from(users).where(eq(users.id, authSession.user.id)).limit(1);
        if (!current?.isActive) return status(403);
        const userRoles = current.role ?? [];

        const hasAllowedRole = userRoles.some((role) =>
          allowedRoles.includes(role as Rtype),
        );
        if (!hasAllowedRole) {
          return status(403);
        }

        return {
          user: { ...authSession.user, role: userRoles, isActive: current.isActive },
          session: authSession.session,
        };
      },
    }),
  });

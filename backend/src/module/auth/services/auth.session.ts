import Elysia from "elysia";
import { auth } from "..";

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

        const userRoles = authSession.user.role;

        const hasAllowedRole = userRoles.some((role) =>
          allowedRoles.includes(role as Rtype),
        );
        if (!hasAllowedRole) {
          return status(403);
        }

        return {
          user: authSession.user,
          session: authSession.session,
        };
      },
    }),
  });

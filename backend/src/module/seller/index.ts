import Elysia from "elysia";
import { auth } from "../auth";
import { addProfileService } from "./service";
import { sellerProfileModel } from "./model";

export type Rtype = "admin" | "buyer" | "seller";

export const allowedRole: Rtype[] = ["seller"];

export const sellerProfileRoute = new Elysia({ prefix: "sellerProfile" })
  .resolve(async ({ request, status }) => {
    const Authsession = await auth.api.getSession({
      headers: request.headers,
    });

    if (!Authsession) {
      return status(401);
    }

    const hasAllowedRole = Authsession.user.role.some((role) => {
      return allowedRole.includes(role as Rtype);
    });

    if (!hasAllowedRole) {
      return status(403);
    }
    return {
      session: Authsession.session,
      user: Authsession.user,
    };
  })

  .post(
    "/addprofile",
    async ({ session, body, status }) => {
      try {
        const profile = await addProfileService(session.userId, body);
        return status(201, {
          message: "Seller profile created",
          profile,
        });
      } catch (error) {
        return status(500, { message: " Failed to create seller profile" });
      }
    },
    {
      body: sellerProfileModel,
    },
  );

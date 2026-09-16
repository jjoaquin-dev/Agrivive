import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { addProfileService } from "../services/service";
import { sellerProfileModel } from "../model/model";

export const sellerAddProfile = new Elysia()
  .use(sessionAuth)
  //upload seller profile
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
      role: ["seller", "buyer"],
    },
  );

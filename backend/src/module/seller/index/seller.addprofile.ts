import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProfileModel } from "../model/addprofile.model";
import { addProfileService } from "../services/addprofile.service";

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

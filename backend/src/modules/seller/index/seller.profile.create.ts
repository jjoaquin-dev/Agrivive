import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProfileModel } from "../model/seller.profile.create";
import { createSellerProfile } from "../services/seller.profile.create";
import { OrderError } from "../../../utils/order-types";

export const sellerProfileCreateRoute = new Elysia()
  .use(sessionAuth)
  .post(
    "/profile",
    async ({ session, body, status }) => {
      try {
        const profile = await createSellerProfile(session.userId, body);
        return status(201, {
          message: "Seller profile created",
          profile,
        });
      } catch (error) {
        if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
        console.error(error);
        return status(500, { message: "Failed to create seller profile" });
      }
    },
    {
      body: sellerProfileModel,
      role: ["seller", "buyer"],
    },
  )
  .post("/addprofile", async ({ session, body, status }) => {
    try {
      const profile = await createSellerProfile(session.userId, body);
      return status(201, { message: "Seller profile created", profile: { user: profile } });
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to create seller profile" });
    }
  }, { body: sellerProfileModel, role: ["seller", "buyer"] });

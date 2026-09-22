import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerProfileUpdateModel } from "../model/seller.profile.update";
import { updateSellerProfile } from "../services/seller.profile.update";

export const sellerProfileUpdateRoute = new Elysia().use(sessionAuth)
  .patch("/profile", async ({ session, body, status }) => {
    try { return await updateSellerProfile(session.userId, body); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to update profile" });
    }
  }, { role: ["seller"], body: sellerProfileUpdateModel });

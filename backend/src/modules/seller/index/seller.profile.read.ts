import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { readSellerProfile } from "../services/seller.profile.read";

export const sellerProfileReadRoute = new Elysia().use(sessionAuth)
  .get("/profile", async ({ session, status }) => {
    try { return await readSellerProfile(session.userId); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to read profile" });
    }
  }, { role: ["seller"] });

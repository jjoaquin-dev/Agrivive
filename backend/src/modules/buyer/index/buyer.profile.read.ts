import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { getBuyerProfile } from "../services/buyer.profile.read";

export const buyerProfileReadRoute = new Elysia().use(sessionAuth)
  .get("/profile", async ({ session, status }) => {
    try {
      return await getBuyerProfile(session.userId);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("[Buyer Profile Read Error]:", error);
      return status(500, { message: "Failed to read buyer profile" });
    }
  }, { role: ["buyer"] });

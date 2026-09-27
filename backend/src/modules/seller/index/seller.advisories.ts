import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { getSellerAdvisories } from "../services/seller.advisories";

export const sellerAdvisoriesRoute = new Elysia()
  .use(sessionAuth)
  .get(
    "/advisories",
    async ({ session, user, status }) => {
      if (!user.isActive) return status(403, { message: "Seller account is inactive" });
      try {
        return await getSellerAdvisories(session.userId);
      } catch (error) {
        if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
        console.error(error);
        return status(500, { message: "Failed to load seller advisories" });
      }
    },
    { role: ["seller"] },
  );

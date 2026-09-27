import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerAnalyticsQuery } from "../model/seller.analytics";
import { OrderError } from "../../../utils/order-types";
import { getSellerAnalytics } from "../services/seller.analytics";

export const sellerAnalyticsRoute = new Elysia()
  .use(sessionAuth)
  .get(
    "/analytics/summary",
    async ({ session, user, query, status }) => {
      if (!user.isActive) return status(403, { message: "Seller account is inactive" });
      try {
        return await getSellerAnalytics(session.userId, query);
      } catch (error) {
        if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
        console.error(error);
        return status(500, { message: "Failed to load seller analytics" });
      }
    },
    { role: ["seller"], query: sellerAnalyticsQuery },
  );

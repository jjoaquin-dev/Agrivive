import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { getSellerWeightedSurplusVisibility } from "../services/seller.weighted.surplus.visibility";
import { OrderError } from "../../../utils/order-types";

export const sellerWeightedVisiblityRoute = new Elysia()
  .use(sessionAuth)
  //get weighted surplus visibility
  .get("/weightedvisibility", async ({ session, status }) => {
    try {
      const weightedSurplusVisiblity =
        await getSellerWeightedSurplusVisibility(session.userId);
      return status(200, {
        message: "Fetched",
        weightedSurplus: weightedSurplusVisiblity,
      });
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: " Failed to fetch" });
    }
  }, { role: ["seller"] });

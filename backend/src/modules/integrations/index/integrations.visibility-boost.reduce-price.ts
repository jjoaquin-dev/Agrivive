import Elysia from "elysia";
import { OrderError } from "../../../utils/order-types";
import { visibilityBoostHeaders, visibilityBoostParams } from "../model/integrations.visibility-boost";
import { isVisibilityBoostAuthorized } from "../services/integrations.visibility-boost.authorize";
import { reduceVisibilityBoostPrice } from "../services/integrations.visibility-boost.reduce-price";

export const integrationsVisibilityBoostReducePriceRoute = new Elysia()
  .post("/integrations/visibility-boosts/:id/reduce-price", async ({ headers, params, status }) => {
    if (!isVisibilityBoostAuthorized(headers.authorization)) {
      return status(401, { message: "Visibility boost authentication required" });
    }
    try {
      return await reduceVisibilityBoostPrice(params.id);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("Visibility boost price reduction failed", error);
      return status(500, { message: "Could not apply the price reduction" });
    }
  }, { params: visibilityBoostParams, headers: visibilityBoostHeaders });

import Elysia, { t } from "elysia";
import { promotionJobParams } from "../model/integrations.promotion";
import { isPromotionServiceAuthorized } from "../services/integrations.promotion.authorize";
import { getIntegrationPromotionContext } from "../services/integrations.promotion.context";
import { OrderError } from "../../../utils/order-types";

export const integrationsPromotionContextRoute = new Elysia()
  .get("/jobs/:id/context", async ({ headers, params, status }) => {
    if (!isPromotionServiceAuthorized(headers.authorization)) {
      return status(401, { message: "Promotion service authentication required" });
    }
    try { return await getIntegrationPromotionContext(params.id); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("Promotion context lookup failed", error);
      return status(500, { message: "Promotion context is unavailable" });
    }
  }, {
    headers: t.Object({ authorization: t.Optional(t.String()) }),
    params: promotionJobParams,
  });

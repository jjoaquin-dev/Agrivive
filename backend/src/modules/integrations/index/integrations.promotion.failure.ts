import Elysia, { t } from "elysia";
import { OrderError } from "../../../utils/order-types";
import { promotionFailureBody, promotionJobParams } from "../model/integrations.promotion";
import { isPromotionServiceAuthorized } from "../services/integrations.promotion.authorize";
import { recordIntegrationPromotionFailure } from "../services/integrations.promotion.failure";

export const integrationsPromotionFailureRoute = new Elysia()
  .post("/jobs/:id/failure", async ({ headers, params, body, status }) => {
    if (!isPromotionServiceAuthorized(headers.authorization)) {
      return status(401, { message: "Promotion service authentication required" });
    }
    try { return await recordIntegrationPromotionFailure(params.id, body.code); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("Promotion failure callback failed", error);
      return status(500, { message: "Promotion failure could not be recorded" });
    }
  }, {
    headers: t.Object({ authorization: t.Optional(t.String()) }),
    params: promotionJobParams,
    body: promotionFailureBody,
  });

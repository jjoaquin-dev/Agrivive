import Elysia, { t } from "elysia";
import { OrderError } from "../../../utils/order-types";
import { promotionDraftBody, promotionJobParams } from "../model/integrations.promotion";
import { isPromotionServiceAuthorized } from "../services/integrations.promotion.authorize";
import { saveIntegrationPromotionDraft } from "../services/integrations.promotion.draft";

export const integrationsPromotionDraftRoute = new Elysia()
  .post("/jobs/:id/draft", async ({ headers, params, body, status }) => {
    if (!isPromotionServiceAuthorized(headers.authorization)) {
      return status(401, { message: "Promotion service authentication required" });
    }
    try { return await saveIntegrationPromotionDraft(params.id, body.headline, body.caption); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("Promotion draft callback failed", error);
      return status(500, { message: "Promotion draft could not be saved" });
    }
  }, {
    headers: t.Object({ authorization: t.Optional(t.String()) }),
    params: promotionJobParams,
    body: promotionDraftBody,
  });

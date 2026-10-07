import Elysia from "elysia";
import { integrationsPromotionContextRoute } from "./index/integrations.promotion.context";
import { integrationsPromotionDraftRoute } from "./index/integrations.promotion.draft";
import { integrationsPromotionFailureRoute } from "./index/integrations.promotion.failure";

export const integrationsRoute = new Elysia({ prefix: "/integrations/promotions" })
  .use(integrationsPromotionContextRoute)
  .use(integrationsPromotionDraftRoute)
  .use(integrationsPromotionFailureRoute);

import Elysia from "elysia";
import { OrderError } from "../../../utils/order-types";
import { isServiceTokenAuthorized } from "../../../utils/service-token";
import {
  visibilityBoostFacebookPostBody,
  visibilityBoostHeaders,
  visibilityBoostParams,
} from "../model/integrations.visibility-boost";
import { getVisibilityBoostContext } from "../services/integrations.visibility-boost.context";
import { postVisibilityBoostToFacebook } from "../services/integrations.visibility-boost.facebook-post";

function isAuthorized(authorization?: string) {
  return isServiceTokenAuthorized(authorization, process.env.N8N_VISIBILITY_BOOST_SERVICE_TOKEN);
}

export const integrationsVisibilityBoostRoute = new Elysia()
  .get("/integrations/visibility-boosts/:id/context", async ({ headers, params, status }) => {
    if (!isAuthorized(headers.authorization)) return status(401, { message: "Visibility boost authentication required" });
    try {
      return await getVisibilityBoostContext(params.id);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("Visibility boost context failed", error);
      return status(500, { message: "Visibility boost context is unavailable" });
    }
  }, { params: visibilityBoostParams, headers: visibilityBoostHeaders })
  .post("/integrations/visibility-boosts/:id/facebook-post", async ({ body, headers, params, status }) => {
    if (!isAuthorized(headers.authorization)) return status(401, { message: "Visibility boost authentication required" });
    try {
      return await postVisibilityBoostToFacebook(params.id, body.caption);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("Visibility boost Facebook post failed", error);
      return status(500, { message: "Could not publish the Facebook post" });
    }
  }, { params: visibilityBoostParams, headers: visibilityBoostHeaders, body: visibilityBoostFacebookPostBody });

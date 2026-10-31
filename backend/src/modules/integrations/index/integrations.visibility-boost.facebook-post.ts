import Elysia from "elysia";
import { OrderError } from "../../../utils/order-types";
import {
  visibilityBoostFacebookPostBody,
  visibilityBoostHeaders,
  visibilityBoostParams,
} from "../model/integrations.visibility-boost";
import { isVisibilityBoostAuthorized } from "../services/integrations.visibility-boost.authorize";
import { postVisibilityBoostToSocial } from "../services/integrations.visibility-boost.social-post";

export const integrationsVisibilityBoostFacebookPostRoute = new Elysia()
  .post("/integrations/visibility-boosts/:id/facebook-post", async ({ body, headers, params, status }) => {
    if (!isVisibilityBoostAuthorized(headers.authorization)) {
      return status(401, { message: "Visibility boost authentication required" });
    }
    try {
      return await postVisibilityBoostToSocial(params.id, body);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("Visibility boost Facebook post failed", error);
      return status(500, { message: "Could not publish the post" });
    }
  }, { params: visibilityBoostParams, headers: visibilityBoostHeaders, body: visibilityBoostFacebookPostBody });

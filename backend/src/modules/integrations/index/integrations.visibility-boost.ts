import Elysia, { t } from "elysia";
import { OrderError } from "../../../utils/order-types";
import { isVisibilityBoostAuthorized } from "../services/integrations.visibility-boost.authorize";
import { getVisibilityBoostContext } from "../services/integrations.visibility-boost.context";

export const integrationsVisibilityBoostRoute = new Elysia()
  .get("/integrations/visibility-boosts/:id/context", async ({ headers, params, status }) => {
    if (!isVisibilityBoostAuthorized(headers.authorization)) return status(401, { message: "Visibility boost authentication required" });
    try {
      return await getVisibilityBoostContext(params.id);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("Visibility boost context failed", error);
      return status(500, { message: "Visibility boost context is unavailable" });
    }
  }, {
    params: t.Object({ id: t.String({ format: "uuid" }) }),
    headers: t.Object({ authorization: t.Optional(t.String()) }),
  });

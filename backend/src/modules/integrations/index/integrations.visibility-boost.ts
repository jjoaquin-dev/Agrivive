import { timingSafeEqual } from "node:crypto";
import Elysia, { t } from "elysia";
import { OrderError } from "../../../utils/order-types";
import { getVisibilityBoostContext } from "../services/integrations.visibility-boost.context";

function isAuthorized(authorization?: string) {
  const expected = process.env.N8N_VISIBILITY_BOOST_SERVICE_TOKEN?.trim();
  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  const provided = Buffer.from(authorization.slice(7).trim());
  const expectedBytes = Buffer.from(expected);
  return provided.length > 0 && provided.length === expectedBytes.length && timingSafeEqual(provided, expectedBytes);
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
  }, {
    params: t.Object({ id: t.String({ format: "uuid" }) }),
    headers: t.Object({ authorization: t.Optional(t.String()) }),
  });

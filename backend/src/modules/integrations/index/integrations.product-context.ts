import Elysia, { t } from "elysia";
import { getProductUnifiedContext } from "../services/integrations.product-context";
import { OrderError } from "../../../utils/order-types";

export const integrationsProductContextRoute = new Elysia()
  .get(
    "/integrations/products/:id/context",
    async ({ params, status }) => {
      try {
        return await getProductUnifiedContext(params.id);
      } catch (error) {
        if (error instanceof OrderError) {
          return status(error.statusCode, { message: error.message });
        }
        console.error("Could not fetch unified product context", error);
        return status(500, { message: "Could not fetch product context" });
      }
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
    },
  );

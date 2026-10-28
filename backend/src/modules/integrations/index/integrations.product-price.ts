import Elysia, { t } from "elysia";
import { reduceSellerProductPriceByPercent } from "../services/integrations.product-price-reduce";
import { OrderError } from "../../../utils/order-types";

export const integrationsProductPriceRoute = new Elysia()
  .post(
    "/integrations/products/:id/reduce-price",
    async ({ params, status }) => {
      try {
        return await reduceSellerProductPriceByPercent(params.id);
      } catch (error) {
        if (error instanceof OrderError) {
          return status(error.statusCode, { message: error.message });
        }
        console.error("Price reduction failed", error);
        return status(500, { message: "Could not apply price reduction" });
      }
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
    },
  );

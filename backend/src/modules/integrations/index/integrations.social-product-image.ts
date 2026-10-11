import Elysia from "elysia";
import { t } from "elysia";
import { OrderError } from "../../../utils/order-types";
import { getPublicSocialProductImage } from "../services/integrations.social-product-image";

export const integrationsSocialProductImageRoute = new Elysia()
  .get("/integrations/media/social-products/:id", async ({ params, status }) => {
    try {
      const image = await getPublicSocialProductImage(params.id);
      return new Response(image.body, {
        headers: {
          "Content-Type": image.contentType,
          "Cache-Control": "public, max-age=300",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("Public social product image request failed", error);
      return status(500, { message: "Could not load product photo" });
    }
  }, { params: t.Object({ id: t.String({ format: "uuid" }) }) });

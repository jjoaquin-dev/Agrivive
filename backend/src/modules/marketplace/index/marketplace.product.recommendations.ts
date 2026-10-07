import Elysia from "elysia";
import { OrderError } from "../../../utils/order-types";
import { marketplaceProductRecommendationParams } from "../model/marketplace.product.recommendations";
import { getMarketplaceProductRecommendations } from "../services/marketplace.product.recommendations";

export const marketplaceProductRecommendationsRoute = new Elysia()
  .get("/products/:id/recommendations", async ({ params, status }) => {
    try {
      return await getMarketplaceProductRecommendations(params.id);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Marketplace recommendations are unavailable" });
    }
  }, { params: marketplaceProductRecommendationParams });

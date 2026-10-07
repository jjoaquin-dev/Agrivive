import Elysia from "elysia";
import { marketplaceProductsRoute } from "./index/marketplace.products";
import { marketplaceProductRecommendationsRoute } from "./index/marketplace.product.recommendations";
import { marketplaceSellerMapRoute } from "./index/marketplace.sellers.map";

export const marketplaceRoute = new Elysia({ prefix: "/marketplace" })
  .use(marketplaceSellerMapRoute)
  .use(marketplaceProductRecommendationsRoute)
  .use(marketplaceProductsRoute);

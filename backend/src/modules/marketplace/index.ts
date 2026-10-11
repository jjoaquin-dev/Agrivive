import Elysia from "elysia";
import { marketplaceProductsRoute } from "./index/marketplace.products";
import { marketplaceSellerMapRoute } from "./index/marketplace.sellers.map";

export const marketplaceRoute = new Elysia({ prefix: "/marketplace" })
  .use(marketplaceSellerMapRoute)
  .use(marketplaceProductsRoute);

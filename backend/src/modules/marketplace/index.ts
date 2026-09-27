import Elysia from "elysia";
import { marketplaceProductsRoute } from "./index/marketplace.products";

export const marketplaceRoute = new Elysia({ prefix: "/marketplace" })
  .use(marketplaceProductsRoute);

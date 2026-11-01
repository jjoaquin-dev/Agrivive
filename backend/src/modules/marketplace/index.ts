import Elysia from "elysia";
import { marketplaceOverviewRoute } from "./index/marketplace.overview";
import { marketplaceDealsRoute } from "./index/marketplace.products.deals";
import { marketplaceProductsRoute } from "./index/marketplace.products";
import { marketplaceSellerMapRoute } from "./index/marketplace.sellers.map";

export const marketplaceRoute = new Elysia({ prefix: "/marketplace" })
  .use(marketplaceSellerMapRoute)
  .use(marketplaceDealsRoute)
  .use(marketplaceProductsRoute)
  .use(marketplaceOverviewRoute);

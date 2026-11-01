import Elysia from "elysia";
import { marketplaceDealsQuery } from "../model/marketplace.products.deals";
import { listMarketplaceDeals } from "../services/marketplace.products.deals";

export const marketplaceDealsRoute = new Elysia()
  .get("/products/deals", async ({ query, status }) => {
    try { return await listMarketplaceDeals(query.limit ?? 8); }
    catch (error) {
      console.error(error);
      return status(500, { message: "Marketplace deals failed" });
    }
  }, { query: marketplaceDealsQuery });

import Elysia from "elysia";
import { readMarketplaceOverview } from "../services/marketplace.overview";
import { marketplaceOverviewQuerySchema } from "../model/marketplace.overview";

export const marketplaceOverviewRoute = new Elysia()
  .get(
    "/overview",
    async ({ query, status }) => {
      try {
        const range = query.range || "month";
        return await readMarketplaceOverview(range);
      } catch (error) {
        console.error("Failed to read marketplace overview:", error);
        return status(500, { message: "Failed to read marketplace overview" });
      }
    },
    {
      query: marketplaceOverviewQuerySchema,
    }
  );

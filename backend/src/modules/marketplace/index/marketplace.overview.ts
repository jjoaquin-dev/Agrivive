import Elysia from "elysia";
import { readMarketplaceOverview } from "../services/marketplace.overview";
import { readOverviewExplanations } from "../services/marketplace.overview.explain";
import { marketplaceOverviewQuerySchema } from "../model/marketplace.overview";

export const marketplaceOverviewRoute = new Elysia()
  .get(
    "/overview",
    async ({ query, status }) => {
      try {
        return await readMarketplaceOverview(query);
      } catch (error) {
        console.error("Failed to read marketplace overview:", error);
        return status(500, { message: "Failed to read marketplace overview" });
      }
    },
    { query: marketplaceOverviewQuerySchema },
  )
  .get(
    "/overview/explanations",
    async ({ query, status }) => {
      try {
        return await readOverviewExplanations(query);
      } catch (error) {
        console.error("Failed to write overview explanations:", error);
        return status(500, { message: "Failed to write overview explanations" });
      }
    },
    { query: marketplaceOverviewQuerySchema },
  );

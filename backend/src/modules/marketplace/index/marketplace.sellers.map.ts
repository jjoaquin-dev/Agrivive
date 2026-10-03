import Elysia from "elysia";
import { OrderError } from "../../../utils/order-types";
import { marketplaceSellersMapQuery } from "../model/marketplace.sellers.map";
import { listMarketplaceSellersMap } from "../services/marketplace.sellers.map";

function marketplaceFailure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error(error);
  return status(500, { message: "Marketplace operation failed" });
}

export const marketplaceSellerMapRoute = new Elysia()
  .get("/sellers/map", async ({ query, status }) => {
    try { return await listMarketplaceSellersMap(query); }
    catch (error) { return marketplaceFailure(error, status); }
  }, { query: marketplaceSellersMapQuery });

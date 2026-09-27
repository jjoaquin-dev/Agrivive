import Elysia from "elysia";
import { OrderError } from "../../../utils/order-types";
import { marketplaceProductParams, marketplaceProductsQuery, marketplaceSellerParams } from "../model/marketplace.products";
import { getMarketplaceProduct } from "../services/marketplace.product.get";
import { getMarketplaceSeller } from "../services/marketplace.seller.get";
import { listMarketplaceProducts } from "../services/marketplace.products.list";
import { listMarketplaceProductReviews } from "../services/marketplace.product.reviews.list";

function marketplaceFailure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error(error);
  return status(500, { message: "Marketplace operation failed" });
}

export const marketplaceProductsRoute = new Elysia()
  .get("/products", async ({ query, status }) => {
    try { return await listMarketplaceProducts(query); }
    catch (error) { return marketplaceFailure(error, status); }
  }, { query: marketplaceProductsQuery })
  .get("/products/:id", async ({ params, status }) => {
    try { return await getMarketplaceProduct(params.id); }
    catch (error) { return marketplaceFailure(error, status); }
  }, { params: marketplaceProductParams })
  .get("/products/:id/reviews", async ({ params, status }) => {
    try { return await listMarketplaceProductReviews(params.id); }
    catch (error) { return marketplaceFailure(error, status); }
  }, { params: marketplaceProductParams })
  .get("/sellers/:id", async ({ params, status }) => {
    try { return await getMarketplaceSeller(params.id); }
    catch (error) { return marketplaceFailure(error, status); }
  }, { params: marketplaceSellerParams });

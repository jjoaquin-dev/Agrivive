import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerVegetableCatalogQuery } from "../model/seller.vegetable-catalog";
import { listSellerVegetableCatalog } from "../services/seller.vegetable-catalog";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerVegetableCatalogRoute = new Elysia().use(sessionAuth)
  .get("/vegetable-catalog", async ({ query, status }) => {
    try { return await listSellerVegetableCatalog(query); }
    catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], query: sellerVegetableCatalogQuery });

import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProductAdjustStock, sellerProductAdjustStockParams } from "../model/seller.product.adjust-stock";
import { adjustSellerProductStock } from "../services/seller.product.adjust-stock";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerProductAdjustStockRoute = new Elysia().use(sessionAuth)
  .post("/products/:id/stock-adjustments", async ({ session, params, body, status }) => {
    try { return await adjustSellerProductStock(session.userId, params.id, body.delta, body.reason); }
    catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductAdjustStockParams, body: sellerProductAdjustStock });

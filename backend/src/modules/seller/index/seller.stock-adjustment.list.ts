import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerStockAdjustmentListQuery } from "../model/seller.stock-adjustment.list";
import { listSellerStockAdjustments } from "../services/seller.stock-adjustment.list";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerStockAdjustmentListRoute = new Elysia().use(sessionAuth)
  .get("/stock-adjustments", async ({ session, query, status }) => {
    try {
      return await listSellerStockAdjustments(session.userId, query);
    } catch (error) {
      return sellerProductFailure(error, status);
    }
  }, {
    role: ["seller"],
    query: sellerStockAdjustmentListQuery,
  });

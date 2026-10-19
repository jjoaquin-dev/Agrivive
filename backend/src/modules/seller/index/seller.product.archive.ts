import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProductArchiveParams } from "../model/seller.product.archive";
import { archiveSellerProduct } from "../services/seller.product.archive";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerProductArchiveRoute = new Elysia().use(sessionAuth)
  .delete("/products/:id", async ({ session, params, status }) => {
    try {
      const product = await archiveSellerProduct(session.userId, params.id);
      return status(200, product);
    } catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductArchiveParams })
  .post("/products/:id/archive", async ({ session, params, status }) => {
    try {
      const product = await archiveSellerProduct(session.userId, params.id);
      return status(200, product);
    } catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductArchiveParams });


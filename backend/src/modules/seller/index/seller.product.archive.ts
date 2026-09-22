import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProductArchiveParams } from "../model/seller.product.archive";
import { archiveSellerProduct } from "../services/seller.product.archive";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerProductArchiveRoute = new Elysia().use(sessionAuth)
  .delete("/products/:id", async ({ session, params, set, status }) => {
    try {
      await archiveSellerProduct(session.userId, params.id);
      set.status = 204;
      return;
    } catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductArchiveParams });

import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProductReactivateParams } from "../model/seller.product.reactivate";
import { reactivateSellerProduct } from "../services/seller.product.reactivate";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerProductReactivateRoute = new Elysia().use(sessionAuth)
  .post("/products/:id/reactivate", async ({ session, params, status }) => {
    try { return await reactivateSellerProduct(session.userId, params.id); }
    catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductReactivateParams });

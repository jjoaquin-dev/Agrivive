import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProductGetParams } from "../model/seller.product.get";
import { getSellerProduct } from "../services/seller.product.get";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerProductGetRoute = new Elysia().use(sessionAuth)
  .get("/products/:id", async ({ session, params, status }) => {
    try { return await getSellerProduct(session.userId, params.id); }
    catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductGetParams });

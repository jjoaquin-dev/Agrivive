import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProductId, sellerProductRestock, sellerProductUpdate } from "../model/seller.product";
import { listSellerProducts } from "../services/seller.product.list";
import { updateSellerProduct } from "../services/seller.product.update";
import { restockSellerProduct } from "../services/seller.product.restock";
import { deactivateSellerProduct } from "../services/seller.product.deactivate";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerProductsRoute = new Elysia().use(sessionAuth)
  .get("/products", async ({ session, status }) => {
    try { return await listSellerProducts(session.userId); }
    catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"] })
  .patch("/products/:id", async ({ session, params, body, status }) => {
    try { return await updateSellerProduct(session.userId, params.id, body); }
    catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductId, body: sellerProductUpdate })
  .post("/products/:id/restock", async ({ session, params, body, status }) => {
    try { return await restockSellerProduct(session.userId, params.id, body.quantity); }
    catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductId, body: sellerProductRestock })
  .post("/products/:id/deactivate", async ({ session, params, status }) => {
    try { return await deactivateSellerProduct(session.userId, params.id); }
    catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductId });

import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProductId } from "../model/seller.product";
import { sellerPriceDropHistoryQuery, sellerPriceReductionToggleBody } from "../model/seller.price-reduction";
import { listSellerPriceDropHistory } from "../services/seller.price-reduction.history.list";
import { setSellerPriceReductionEnabled } from "../services/seller.price-reduction.toggle";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerPriceReductionRoute = new Elysia().use(sessionAuth)
  .get("/price-drops", async ({ session, query, status }) => {
    try {
      return await listSellerPriceDropHistory(session.userId, query?.limit, query?.cursor);
    } catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], query: sellerPriceDropHistoryQuery })
  .patch("/products/:id/price-reduction", async ({ session, params, body, status }) => {
    try {
      return await setSellerPriceReductionEnabled(session.userId, params.id, body.enabled);
    } catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductId, body: sellerPriceReductionToggleBody });

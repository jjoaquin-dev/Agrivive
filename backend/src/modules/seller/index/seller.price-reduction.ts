import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProductId } from "../model/seller.product";
import { sellerPriceDropHistoryQuery, sellerPriceReductionToggleBody } from "../model/seller.price-reduction";
import { listSellerPriceDropHistory } from "../services/seller.price-reduction.history.list";
import { setSellerPriceReductionEnabled } from "../services/seller.price-reduction.toggle";
import { listSellerRunningPriceDrops } from "../services/seller.price-reduction.running.list";
import { requestSellerPriceDropNow } from "../services/seller.price-reduction.drop-now";
import { deliverSellerBoostFollowUps } from "../../../jobs/deliver-seller-boost-follow-ups";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerPriceReductionRoute = new Elysia().use(sessionAuth)
  .get("/price-drops/running", async ({ session, status }) => {
    try {
      return await listSellerRunningPriceDrops(session.userId);
    } catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"] })
  .get("/price-drops", async ({ session, query, status }) => {
    try {
      return await listSellerPriceDropHistory(session.userId, query?.limit, query?.cursor);
    } catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], query: sellerPriceDropHistoryQuery })
  .patch("/products/:id/price-reduction", async ({ session, params, body, status }) => {
    try {
      const saved = await setSellerPriceReductionEnabled(session.userId, params.id, body.enabled, {
        amount: body.amount, minimumPrice: body.minimumPrice,
      });
      // The first drop is due right away: send it now; the worker's next pass is the safety net.
      if (saved.dropNow) void deliverSellerBoostFollowUps().catch((error) => console.error("Immediate price drop delivery failed", error));
      return saved;
    } catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductId, body: sellerPriceReductionToggleBody })
  .post("/products/:id/price-drop", async ({ session, params, status }) => {
    try {
      const queued = await requestSellerPriceDropNow(session.userId, params.id);
      // Send it to n8n now; the worker's next pass is the safety net.
      void deliverSellerBoostFollowUps().catch((error) => console.error("Immediate price drop delivery failed", error));
      return queued;
    } catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductId });

import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerCorrectionBody, sellerTrustEventParams } from "../model/seller.trust";
import { listSellerTrustEvents } from "../services/seller.trust.events";
import { correctSellerTrustEvent } from "../services/seller.trust.correct";

export const sellerTrustRoute = new Elysia().use(sessionAuth)
  .get("/trust", async ({ session, status }) => {
    try { return await listSellerTrustEvents(session.userId); }
    catch (error) {
      console.error(error);
      return status(500, { message: "Failed to read trust history" });
    }
  }, { role: ["seller"] })
  .post("/trust/events/:id/correction", async ({ session, params, body, status }) => {
    try { return status(201, await correctSellerTrustEvent(session.userId, params.id, body.reason)); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to check correction" });
    }
  }, { role: ["seller"], params: sellerTrustEventParams, body: sellerCorrectionBody });

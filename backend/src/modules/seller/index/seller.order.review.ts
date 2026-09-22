import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { readOrderReview } from "../../../utils/trust/read-review";
import { sellerReviewParams, sellerReviewResponseBody } from "../model/seller.order.review";
import { respondSellerReview } from "../services/seller.order.review.respond";

export const sellerReviewRoute = new Elysia().use(sessionAuth)
  .get("/orders/:id/review", async ({ session, params, status }) => {
    try { return await readOrderReview(session.userId, params.id, "seller"); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to read review" });
    }
  }, { role: ["seller"], params: sellerReviewParams })
  .post("/orders/:id/review-response", async ({ session, params, body, status }) => {
    try { return await respondSellerReview(session.userId, params.id, body.response); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to respond to review" });
    }
  }, { role: ["seller"], params: sellerReviewParams, body: sellerReviewResponseBody });

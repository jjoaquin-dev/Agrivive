import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { readOrderReview } from "../../../utils/trust/read-review";
import {
  sellerReviewParams,
  sellerReviewResponseBody,
  sellerReviewsQuery,
} from "../model/seller.order.review";
import { respondSellerReview } from "../services/seller.order.review.respond";
import { respondSellerReviewById } from "../services/seller.review.reply";
import { readSellerReviewsList } from "../services/seller.reviews.list";

export const sellerReviewRoute = new Elysia().use(sessionAuth)
  .get("/reviews", async ({ session, query, status }) => {
    try {
      return await readSellerReviewsList(session.userId, query);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to read seller reviews" });
    }
  }, { role: ["seller"], query: sellerReviewsQuery })
  .post("/reviews/:id/reply", async ({ session, params, body, status }) => {
    try {
      return await respondSellerReviewById(session.userId, params.id, body.response);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to respond to review" });
    }
  }, { role: ["seller"], params: sellerReviewParams, body: sellerReviewResponseBody })
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

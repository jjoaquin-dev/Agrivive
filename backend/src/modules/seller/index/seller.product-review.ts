import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerReviewsQuery } from "../model/seller.order.review";
import { sellerProductReviewParams, sellerProductReviewResponseBody } from "../model/seller.product-review";
import { respondSellerProductReview } from "../services/seller.product-review.reply";
import { readSellerProductReviewsList } from "../services/seller.product-reviews.list";

export const sellerProductReviewRoute = new Elysia().use(sessionAuth)
  .get("/product-reviews", async ({ session, query, status }) => {
    try {
      return await readSellerProductReviewsList(session.userId, query);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to read product reviews" });
    }
  }, { role: ["seller"], query: sellerReviewsQuery })
  .post("/product-reviews/:id/reply", async ({ session, params, body, status }) => {
    try {
      return await respondSellerProductReview(session.userId, params.id, body.response);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to respond to product review" });
    }
  }, { role: ["seller"], params: sellerProductReviewParams, body: sellerProductReviewResponseBody });

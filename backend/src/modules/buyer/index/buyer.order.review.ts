import Elysia, { t } from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { readOrderReview } from "../../../utils/trust/read-review";
import {
  buyerProductReviewBody,
  buyerProductReviewEligibilityParams,
  buyerProductReviewParams,
  buyerReviewBody,
  buyerReviewParams,
} from "../model/buyer.order.review";
import { createBuyerReview } from "../services/buyer.order.review.create";
import { createBuyerProductReview } from "../services/buyer.order.product-review.create";
import { readBuyerProductReview } from "../services/buyer.order.product-review.read";
import { getBuyerProductReviewEligibility } from "../services/buyer.product.review-eligibility";
import { readSellerRating } from "../services/buyer.seller.rating";
import { readSellerReviews } from "../services/buyer.seller.reviews";

export const buyerReviewRoute = new Elysia().use(sessionAuth)
  .get("/sellers/:id/rating", ({ params }) => readSellerRating(params.id), {
    params: t.Object({ id: t.String() }),
  })
  .get("/sellers/:id/reviews", ({ params }) => readSellerReviews(params.id), {
    params: t.Object({ id: t.String() }),
  })
  .get("/products/:id/review-eligibility", async ({ session, params, status }) => {
    try { return await getBuyerProductReviewEligibility(session.userId, params.id); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to check product review eligibility" });
    }
  }, { role: ["buyer"], params: buyerProductReviewEligibilityParams })
  .get("/orders/:id/review", async ({ session, params, status }) => {
    try { return await readOrderReview(session.userId, params.id, "buyer"); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to read review" });
    }
  }, { role: ["buyer"], params: buyerReviewParams })
  .post("/orders/:id/review", async ({ session, params, body, status }) => {
    try { return status(201, await createBuyerReview(session.userId, params.id, body)); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to create review" });
    }
  }, { role: ["buyer"], params: buyerReviewParams, body: buyerReviewBody })
  .post("/orders/:id/items/:itemId/review", async ({ session, params, body, status }) => {
    try {
      return status(201, await createBuyerProductReview(session.userId, params.id, params.itemId, body));
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to create product review" });
    }
  }, {
    role: ["buyer"],
    params: buyerProductReviewParams,
    body: buyerProductReviewBody,
  })
  .get("/orders/:id/items/:itemId/review", async ({ session, params, status }) => {
    try {
      return await readBuyerProductReview(session.userId, params.id, params.itemId);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to read product review" });
    }
  }, { role: ["buyer"], params: buyerProductReviewParams });

import Elysia, { t } from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { readOrderReview } from "../../../utils/trust/read-review";
import { buyerReviewBody, buyerReviewParams } from "../model/buyer.order.review";
import { createBuyerReview } from "../services/buyer.order.review.create";
import { readSellerRating } from "../services/buyer.seller.rating";

export const buyerReviewRoute = new Elysia().use(sessionAuth)
  .get("/sellers/:id/rating", ({ params }) => readSellerRating(params.id), {
    params: t.Object({ id: t.String() }),
  })
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
  }, { role: ["buyer"], params: buyerReviewParams, body: buyerReviewBody });

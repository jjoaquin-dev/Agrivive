import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerCancelBody, sellerCancelParams } from "../model/seller.order.cancel";
import { cancelSellerOrder } from "../services/seller.order.cancel";

export const sellerCancelOrderRoute = new Elysia().use(sessionAuth).post(
  "/orders/:id/cancel",
  async ({ session, params, body, status }) => {
    try { return await cancelSellerOrder(session.userId, params.id, body.reason); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to cancel order" });
    }
  },
  { role: ["seller"], params: sellerCancelParams, body: sellerCancelBody },
);

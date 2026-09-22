import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { orderIdParams } from "../model/buyer.order.cancel";
import { cancelBuyerOrder } from "../services/buyer.order.cancel";

export const buyerOrderCancelRoute = new Elysia().use(sessionAuth).post(
  "/orders/:id/cancel",
  async ({ session, user, params, status }) => {
    if (!user.isActive) return status(403, { message: "Buyer account is inactive" });
    try {
      return await cancelBuyerOrder(params.id, session.userId);
    } catch (error) {
      if (error instanceof OrderError) {
        return status(error.statusCode, { message: error.message });
      }
      console.error(error);
      return status(500, { message: "Failed to cancel order" });
    }
  },
  { role: ["buyer"], params: orderIdParams },
);

import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { orderIdParams } from "../model/buyer.order.get";
import { getBuyerOrder } from "../services/buyer.order.get";

export const buyerOrderGetRoute = new Elysia().use(sessionAuth).get(
  "/orders/:id",
  async ({ session, user, params, status }) => {
    if (!user.isActive)
      return status(403, { message: "Buyer account is inactive" });
    try {
      return await getBuyerOrder(params.id, session.userId);
    } catch (error) {
      if (error instanceof OrderError) {
        return status(error.statusCode, { message: error.message });
      }
      console.error(error);
      return status(500, { message: "Failed to get order" });
    }
  },
  { role: ["buyer"], params: orderIdParams },
);

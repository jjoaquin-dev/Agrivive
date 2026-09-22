import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { orderListQuery } from "../model/buyer.order.list";
import { listBuyerOrders } from "../services/buyer.order.list";

export const buyerOrderListRoute = new Elysia().use(sessionAuth).get(
  "/orders",
  async ({ session, user, query, status }) => {
    if (!user.isActive) return status(403, { message: "Buyer account is inactive" });
    try {
      return await listBuyerOrders(
        session.userId,
        query.limit ? Number(query.limit) : 20,
        query.cursor,
      );
    } catch (error) {
      if (error instanceof OrderError) {
        return status(error.statusCode, { message: error.message });
      }
      console.error(error);
      return status(500, { message: "Failed to list orders" });
    }
  },
  { role: ["buyer"], query: orderListQuery },
);

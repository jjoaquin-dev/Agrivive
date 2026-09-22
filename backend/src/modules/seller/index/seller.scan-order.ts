import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import {
  orderIdParams,
  orderListQuery,
  scanOrderBody,
} from "../model/seller.scan-order";
import { OrderError } from "../../../utils/order-types";
import { listSellerOrders } from "../services/seller.order.list";
import { readSellerOrder } from "../services/seller.order.get";
import { scanSellerOrder } from "../services/seller.scan-order";

export const sellerOrdersRoute = new Elysia()
  .use(sessionAuth)
  .get(
    "/orders",
    async ({ session, user, query, status }) => {
      if (!user.isActive) return status(403, { message: "Seller account is inactive" });
      try {
        return await listSellerOrders(
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
    { role: ["seller"], query: orderListQuery },
  )
  .get(
    "/orders/:id",
    async ({ session, user, params, status }) => {
      if (!user.isActive) return status(403, { message: "Seller account is inactive" });
      try {
        return await readSellerOrder(params.id, session.userId);
      } catch (error) {
        if (error instanceof OrderError) {
          return status(error.statusCode, { message: error.message });
        }
        console.error(error);
        return status(500, { message: "Failed to get order" });
      }
    },
    { role: ["seller"], params: orderIdParams },
  )
  .post(
    "/orders/scan",
    async ({ session, user, body, status }) => {
      if (!user.isActive) return status(403, { message: "Seller account is inactive" });
      try {
        return await scanSellerOrder(session.userId, body);
      } catch (error) {
        if (error instanceof OrderError) {
          return status(error.statusCode, { message: error.message });
        }
        console.error(error);
        return status(500, { message: "Failed to scan order" });
      }
    },
    { role: ["seller"], body: scanOrderBody },
  );

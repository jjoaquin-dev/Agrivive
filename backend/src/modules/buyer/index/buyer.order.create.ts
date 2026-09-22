import Elysia, { t } from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { orderModel } from "../model/buyer.order.create";
import { createDirectOrder } from "../services/buyer.order.create";

export const buyerOrderCreateRoute = new Elysia().use(sessionAuth).post(
  "/orders",
  async ({ session, user, body, headers, status }) => {
    if (!user.isActive) return status(403, { message: "Buyer account is inactive" });
    try {
      const result = await createDirectOrder(
        session.userId,
        body,
        headers["idempotency-key"],
      );
      return status(result.replayed ? 200 : 201, result.order);
    } catch (error) {
      if (error instanceof OrderError) {
        return status(error.statusCode, { message: error.message });
      }
      console.error(error);
      return status(500, { message: "Failed to create order" });
    }
  },
  {
    role: ["buyer"],
    body: orderModel,
    headers: t.Object({
      "idempotency-key": t.String({ minLength: 1, maxLength: 128 }),
    }),
  },
);

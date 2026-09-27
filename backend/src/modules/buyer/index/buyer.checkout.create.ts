import Elysia, { t } from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { checkoutModel } from "../model/buyer.checkout.create";
import { createCartCheckout } from "../services/buyer.checkout.create";

export const buyerCheckoutCreateRoute = new Elysia().use(sessionAuth).post(
  "/checkouts",
  async ({ session, user, body, headers, status }) => {
    if (!user.isActive) return status(403, { message: "Buyer account is inactive" });
    try {
      const result = await createCartCheckout(session.userId, body, headers["idempotency-key"]);
      return status(result.replayed ? 200 : 201, result);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to create checkout" });
    }
  },
  {
    role: ["buyer"],
    body: checkoutModel,
    headers: t.Object({
      "idempotency-key": t.String({ minLength: 1, maxLength: 128 }),
    }),
  },
);

import { t } from "elysia";

const checkoutItemModel = t.Object({
  productId: t.String({ format: "uuid" }),
  quantity: t.Number({
    minimum: 0.01,
    maximum: 99_999_999,
  }),
});

const pickupModel = t.Object({
  sellerId: t.String({ minLength: 1 }),
  pickupStart: t.String({ format: "date-time" }),
  pickupEnd: t.String({ format: "date-time" }),
});

export const checkoutModel = t.Object({
  items: t.Array(checkoutItemModel, { minItems: 1, maxItems: 50 }),
  /** One pickup range for each seller in the cart. */
  pickups: t.Array(pickupModel, { minItems: 1, maxItems: 20 }),
});

export type CheckoutInput = typeof checkoutModel.static;

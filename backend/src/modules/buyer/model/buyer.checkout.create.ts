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
  /** Optional. Without it each order must be picked up before the stall's deadline. */
  pickups: t.Optional(t.Array(pickupModel, { minItems: 1, maxItems: 20 })),
});

export type CheckoutInput = typeof checkoutModel.static;

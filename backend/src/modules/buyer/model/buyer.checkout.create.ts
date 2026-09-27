import { t } from "elysia";

const checkoutItemModel = t.Object({
  productId: t.String({ format: "uuid" }),
  quantity: t.Number({
    minimum: 0.01,
    maximum: 99_999_999,
  }),
});

export const checkoutModel = t.Object({
  items: t.Array(checkoutItemModel, { minItems: 1, maxItems: 50 }),
});

export type CheckoutInput = typeof checkoutModel.static;

import { t } from "elysia";

export const orderModel = t.Object({
  productId: t.String({ format: "uuid" }),
  quantity: t.Number({
    minimum: 0.01,
    maximum: 99_999_999,
  }),
});

export type OrderInput = typeof orderModel.static;

export type ReservedOrderItem = {
  productId: string;
  sellerId: string;
  productName: string;
  scalingType: "sack" | "kilo" | "pile";
  quantity: number;
  unitPrice: string;
  subtotal: string;
};

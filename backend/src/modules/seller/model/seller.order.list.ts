import { t } from "elysia";

export const sellerOrderStatus = t.Union([
  t.Literal("pending"),
  t.Literal("completed"),
  t.Literal("cancelled"),
  t.Literal("expired"),
]);

export const sellerOrderListQuery = t.Object({
  limit: t.Optional(t.String({ pattern: "^(?:[1-9]|[1-4][0-9]|50)$" })),
  cursor: t.Optional(t.String({ format: "uuid" })),
  status: t.Optional(sellerOrderStatus),
});

export type SellerOrderStatus = typeof sellerOrderStatus.static;
export type SellerOrderListQuery = typeof sellerOrderListQuery.static;

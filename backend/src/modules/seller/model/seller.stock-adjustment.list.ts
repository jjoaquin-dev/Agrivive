import { t } from "elysia";

export const sellerStockAdjustmentListQuery = t.Object({
  productId: t.Optional(t.String({ format: "uuid" })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
  cursor: t.Optional(t.String()),
});

export type SellerStockAdjustmentListQuery = typeof sellerStockAdjustmentListQuery.static;

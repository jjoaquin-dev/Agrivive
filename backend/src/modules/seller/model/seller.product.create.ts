import { t } from "elysia";
import { sellerProductScalingType, sellerProductType } from "./seller.product";

export const sellerProductCreate = t.Object({
  catalogId: t.String({
    format: "uuid",
    error: "Choose a vegetable from the catalog",
  }),
  imagUrl: t.String({
    format: "uri",
    error: "A valid image URL is required",
  }),
  productPrice: t.Numeric({
    minimum: 1,
    maximum: 99_999_999.99,
    error: "price must be between 1 and 99999999.99",
  }),
  priceReductionAmount: t.Optional(t.Number({ minimum: 0, maximum: 99_999_999.99 })),
  minimumPrice: t.Optional(t.Nullable(t.Number({ minimum: 1, maximum: 99_999_999.99 }))),
  productQty: t.Numeric({
    minimum: 0.01,
    maximum: 99_999_999,
    error: "quantity must be between 0.01 and 99999999",
  }),
  scalingType: sellerProductScalingType,
  isMarketable: t.Boolean(),
  lowStockThreshold: t.Optional(t.Nullable(t.Number({ minimum: 0, maximum: 99_999_999.99 }))),
  condition: t.Optional(t.UnionEnum(["good", "fair", "needs_inspection"])),
});

export type SellerProductCreate = typeof sellerProductCreate.static;

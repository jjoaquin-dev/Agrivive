import { t } from "elysia";
import { sellerProductScalingType, sellerProductType } from "./seller.product";

export const sellerProductCreate = t.Object({
  productName: t.String({
    minLength: 1,
    pattern: "\\S",
    error: "product name is required",
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
  productQty: t.Numeric({
    minimum: 0.01,
    maximum: 99_999_999,
    error: "quantity must be between 0.01 and 99999999",
  }),
  productType: sellerProductType,
  scalingType: sellerProductScalingType,
  isMarketable: t.Boolean(),
  lowStockThreshold: t.Optional(t.Nullable(t.Number({ minimum: 0, maximum: 99_999_999.99 }))),
});

export type SellerProductCreate = typeof sellerProductCreate.static;

import { t } from "elysia";

export const sellerProductId = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerProductType = t.Union([
  t.Literal("Leafy Greens"),
  t.Literal("Root and Tuber Vegetables"),
  t.Literal("Bulb and Stem Vegetables"),
  t.Literal("Flower Vegetables"),
  t.Literal("Fruit Vegetables"),
  t.Literal("Seeds and Legumes"),
]);
export const sellerProductScalingType = t.Union([
  t.Literal("sack"),
  t.Literal("kilo"),
  t.Literal("pile"),
]);
export const sellerProductUpdate = t.Object({
  productName: t.Optional(t.String({ minLength: 1, pattern: "\\S" })),
  imagUrl: t.Optional(t.String({ format: "uri" })),
  productPrice: t.Optional(t.Number({ minimum: 1, maximum: 99_999_999.99 })),
  productType: t.Optional(sellerProductType),
  isMarketable: t.Optional(t.Boolean()),
  lowStockThreshold: t.Optional(t.Nullable(t.Number({ minimum: 0, maximum: 99_999_999.99 }))),
}, { minProperties: 1, additionalProperties: false });
export const sellerProductRestock = t.Object({ quantity: t.Number({ minimum: .01, maximum: 99_999_999 }) });
export type SellerProductUpdate = typeof sellerProductUpdate.static;
export type SellerProductRestock = typeof sellerProductRestock.static;

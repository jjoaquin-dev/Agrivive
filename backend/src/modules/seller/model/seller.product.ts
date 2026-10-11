import { t } from "elysia";

export const sellerProductId = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerProductType = t.Union([
  t.Literal("Leafy Greens"),
  t.Literal("Root Vegetables"),
  t.Literal("Bulb Vegetables"),
  t.Literal("Stem Vegetables"),
  t.Literal("Flower Vegetables"),
  t.Literal("Fruit Vegetables"),
  t.Literal("Pod Vegetables"),
  t.Literal("Tuber Vegetables"),
  t.Literal("Seed Vegetables"),
]);
export const sellerProductScalingType = t.Union([
  t.Literal("sack"),
  t.Literal("kilo"),
  t.Literal("pile"),
]);
export const sellerProductUpdate = t.Object({
  catalogId: t.Optional(t.String({ format: "uuid" })),
  imagUrl: t.Optional(t.String({ format: "uri" })),
  productPrice: t.Optional(t.Number({ minimum: 1, maximum: 99_999_999.99 })),
  priceReductionPercent: t.Optional(t.Number({ minimum: 0, maximum: 99.99 })),
  minimumPrice: t.Optional(t.Nullable(t.Number({ minimum: 1, maximum: 99_999_999.99 }))),
  isMarketable: t.Optional(t.Boolean()),
  lowStockThreshold: t.Optional(t.Nullable(t.Number({ minimum: 0, maximum: 99_999_999.99 }))),
  condition: t.Optional(t.UnionEnum(["good", "fair", "needs_inspection"])),
}, { minProperties: 1, additionalProperties: false });
export const sellerProductRestock = t.Object({ quantity: t.Number({ minimum: .01, maximum: 99_999_999 }) });
export type SellerProductUpdate = typeof sellerProductUpdate.static;
export type SellerProductRestock = typeof sellerProductRestock.static;

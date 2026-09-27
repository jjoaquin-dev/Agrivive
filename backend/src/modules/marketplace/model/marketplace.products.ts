import { t } from "elysia";

export const marketplaceProductType = t.Union([
  t.Literal("Leafy Greens"),
  t.Literal("Root and Tuber Vegetables"),
  t.Literal("Bulb and Stem Vegetables"),
  t.Literal("Flower Vegetables"),
  t.Literal("Fruit Vegetables"),
  t.Literal("Seeds and Legumes"),
]);

export const marketplaceUnit = t.Union([
  t.Literal("sack"),
  t.Literal("kilo"),
  t.Literal("pile"),
]);

export const marketplaceSellerType = t.Union([
  t.Literal("supplier"),
  t.Literal("supplier_vendor"),
  t.Literal("retail_vendor"),
]);

export const marketplaceProductsQuery = t.Object({
  sellerId: t.Optional(t.String({ minLength: 1, maxLength: 128 })),
  search: t.Optional(t.String({ maxLength: 120 })),
  productType: t.Optional(marketplaceProductType),
  unit: t.Optional(marketplaceUnit),
  sellerType: t.Optional(marketplaceSellerType),
  minPrice: t.Optional(t.Numeric({ minimum: 0, maximum: 99_999_999.99 })),
  maxPrice: t.Optional(t.Numeric({ minimum: 0, maximum: 99_999_999.99 })),
  minQuantity: t.Optional(t.Numeric({ minimum: 0, maximum: 99_999_999 })),
  maxQuantity: t.Optional(t.Numeric({ minimum: 0, maximum: 99_999_999 })),
  latitude: t.Optional(t.Numeric({ minimum: -90, maximum: 90 })),
  longitude: t.Optional(t.Numeric({ minimum: -180, maximum: 180 })),
  radiusKm: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
  limit: t.Optional(t.Integer({ minimum: 1, maximum: 50 })),
  cursor: t.Optional(t.String({ maxLength: 300 })),
});

export const marketplaceProductParams = t.Object({
  id: t.String({ format: "uuid" }),
});

export const marketplaceSellerParams = t.Object({
  id: t.String({ minLength: 1, maxLength: 128 }),
});

export type MarketplaceProductsQuery = typeof marketplaceProductsQuery.static;

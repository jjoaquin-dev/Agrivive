import { t } from "elysia";
import {
  marketplaceProductType,
  marketplaceSellerType,
  marketplaceUnit,
} from "./marketplace.products";

export const marketplaceSellersMapQuery = t.Object({
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
});

export type MarketplaceSellersMapQuery = typeof marketplaceSellersMapQuery.static;

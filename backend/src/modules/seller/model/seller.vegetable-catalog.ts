import { t } from "elysia";
import { sellerProductType } from "./seller.product";

export const sellerVegetableCatalogQuery = t.Object({
  search: t.Optional(t.String({ maxLength: 120 })),
  category: t.Optional(sellerProductType),
  limit: t.Optional(t.Integer({ minimum: 1, maximum: 100 })),
});

export type SellerVegetableCatalogQuery = typeof sellerVegetableCatalogQuery.static;

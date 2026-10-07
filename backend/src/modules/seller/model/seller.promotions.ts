import { t } from "elysia";

export const sellerPromotionsQuery = t.Object({
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50, default: 20 })),
  cursor: t.Optional(t.String({ format: "uuid" })),
});

export const sellerPromotionParams = t.Object({ id: t.String({ format: "uuid" }) });

export type SellerPromotionsQuery = typeof sellerPromotionsQuery.static;

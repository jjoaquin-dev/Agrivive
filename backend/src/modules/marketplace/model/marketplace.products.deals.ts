import { t } from "elysia";

export const marketplaceDealsQuery = t.Object({
  limit: t.Optional(t.Integer({ minimum: 1, maximum: 12 })),
});

export type MarketplaceDealsQuery = typeof marketplaceDealsQuery.static;

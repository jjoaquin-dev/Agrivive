import { t } from "elysia";

export const sellerAnalyticsQuery = t.Object({
  from: t.Optional(t.String({ format: "date" })),
  to: t.Optional(t.String({ format: "date" })),
  productId: t.Optional(t.String({ format: "uuid" })),
  unit: t.Optional(
    t.Union([t.Literal("sack"), t.Literal("kilo"), t.Literal("pile")]),
  ),
});

export type SellerAnalyticsQuery = typeof sellerAnalyticsQuery.static;

export type SellerAnalyticsMetrics = {
  period: {
    from: string;
    to: string;
    previousFrom: string;
    previousTo: string;
  };
  filter: {
    productId?: string;
    unit?: "sack" | "kilo" | "pile";
  };
  metrics: {
    postedQuantity: string;
    availableQuantity: string;
    reservedQuantity: string;
    completedQuantity: string;
    cancelledQuantity: string;
    expiredQuantity: string;
    remainingQuantity: string;
    completedSalesTotal: string;
    sellThroughRate: number | null;
    completedQuantityChange: number | null;
    recurringListings: number;
  };
  notComputable: {
    sellThroughRate: boolean;
    completedQuantityChange: boolean;
  };
};

export type SellerAnalyticsResponse = SellerAnalyticsMetrics & {
  summary: string | null;
  summaryStatus: "generated" | "unavailable";
};

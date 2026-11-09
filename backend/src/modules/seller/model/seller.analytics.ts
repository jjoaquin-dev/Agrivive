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
    productName?: string;
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

export type SellerAnalyticsInsights = {
  orders: { placed: number; pickedUp: number; cancelled: number; expired: number; declined: number };
  averageOrder: number | null;
  buyers: { total: number; returning: number };
  topProduce: { name: string; unit: string; quantity: number; sales: number }[];
  /** Pickups per day, Sunday first, in Philippine time. */
  pickupsByWeekday: number[];
  averageReplyMinutes: number | null;
  /** stars[0] is the number of 1-star reviews, stars[4] the 5-star ones. allTime is true when no review fell in these days. */
  rating: { average: number; count: number; stars: number[]; allTime: boolean } | null;
  totalSales: number;
  smallestOrder: number | null;
  largestOrder: number | null;
  dailySales: { date: string; sales: number; pickups: number }[];
};

export type SellerAnalyticsResponse = SellerAnalyticsMetrics & {
  insights: SellerAnalyticsInsights;
  summary: string | null;
  summaryStatus: "generated" | "unavailable";
};

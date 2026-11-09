export type AnalyticsUnit = "sack" | "kilo" | "pile";

export interface SellerAnalyticsMetrics {
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
}

export interface SellerAnalyticsInsights {
  orders: { placed: number; pickedUp: number; cancelled: number; expired: number; declined: number };
  averageOrder: number | null;
  buyers: { total: number; returning: number };
  topProduce: { name: string; unit: string; quantity: number; sales: number }[];
  pickupsByWeekday: number[];
  averageReplyMinutes: number | null;
  rating: { average: number; count: number; stars: number[]; allTime: boolean } | null;
  totalSales: number;
  smallestOrder: number | null;
  largestOrder: number | null;
  dailySales: { date: string; sales: number; pickups: number }[];
}

export interface SellerAnalyticsResponse {
  insights: SellerAnalyticsInsights;
  period: {
    from: string;
    to: string;
    previousFrom: string;
    previousTo: string;
  };
  filter: {
    productId?: string;
    productName?: string;
    unit?: AnalyticsUnit;
  };
  metrics: SellerAnalyticsMetrics;
  notComputable: {
    sellThroughRate: boolean;
    completedQuantityChange: boolean;
  };
  summary: string | null;
  summaryStatus: "generated" | "unavailable";
  summarySource?: "ai" | "template";
}

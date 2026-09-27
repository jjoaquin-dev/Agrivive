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

export interface SellerAnalyticsResponse {
  period: {
    from: string;
    to: string;
    previousFrom: string;
    previousTo: string;
  };
  filter: {
    productId?: string;
    unit?: AnalyticsUnit;
  };
  metrics: SellerAnalyticsMetrics;
  notComputable: {
    sellThroughRate: boolean;
    completedQuantityChange: boolean;
  };
  summary: string | null;
  summaryStatus: "generated" | "unavailable";
}

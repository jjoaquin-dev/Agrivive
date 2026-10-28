import { t } from "elysia";

export const marketplaceOverviewQuerySchema = t.Object({
  range: t.Optional(t.Union([t.Literal("week"), t.Literal("month"), t.Literal("year")])),
});

export type MarketplaceOverviewRange = "week" | "month" | "year";

export interface TopProduceItem {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  unit: string;
  orderCount: number;
  totalValue: number;
}

export interface ActivityTrendPoint {
  label: string;
  date: string;
  quantity: number;
  orderCount: number;
}

export interface CategoryDistributionItem {
  category: string;
  activeCount: number;
  percentage: number;
}

export interface MarketplaceOverviewResponse {
  generatedAt: string;
  range: MarketplaceOverviewRange;
  isSampleData: boolean;
  kpis: {
    totalRescuedQty: number;
    activeListings: number;
    totalOrders: number;
    fulfillmentRate: number;
    activeSellers: number;
    activeBuyers: number;
  };
  topProduce: TopProduceItem[];
  activityTrends: ActivityTrendPoint[];
  categoryBreakdown: CategoryDistributionItem[];
}

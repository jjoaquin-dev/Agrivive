import { apiRequest } from "@/src/lib/api";

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

export function getMarketplaceOverview(range: MarketplaceOverviewRange = "month", signal?: AbortSignal) {
  return apiRequest<MarketplaceOverviewResponse>(`/marketplace/overview?range=${range}`, { signal });
}

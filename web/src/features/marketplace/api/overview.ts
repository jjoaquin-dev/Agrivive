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

export interface StallOverviewItem {
  id: string;
  shopName: string;
  detailAddress: string;
  activeListings: number;
  totalStockKg: number;
}

export interface BuyerCommunitySummary {
  registeredBuyers: number;
  activeBuyersWithOrders: number;
  completedPickups: number;
  pendingPickups: number;
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
  sellerStalls: StallOverviewItem[];
  buyerSummary: BuyerCommunitySummary;
}

// An API that has not been redeployed yet may omit the newer lists; default them so the page still renders.
export async function getMarketplaceOverview(range: MarketplaceOverviewRange = "month", signal?: AbortSignal) {
  const res = await apiRequest<MarketplaceOverviewResponse>(`/marketplace/overview?range=${range}`, { signal });
  return {
    ...res,
    topProduce: res.topProduce ?? [],
    activityTrends: res.activityTrends ?? [],
    categoryBreakdown: res.categoryBreakdown ?? [],
    sellerStalls: res.sellerStalls ?? [],
    buyerSummary: res.buyerSummary ?? { registeredBuyers: 0, activeBuyersWithOrders: 0, completedPickups: 0, pendingPickups: 0 },
  };
}

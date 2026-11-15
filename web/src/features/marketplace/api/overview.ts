import { apiRequest } from "@/src/lib/api";

export type OverviewBucket = "day" | "week" | "month";
export type OverviewUnit = "kg" | "sack" | "pile";

export interface UnitQuantity {
  unit: OverviewUnit;
  quantity: number;
}

export interface TopProduceItem {
  id: string;
  name: string;
  category: string;
  unit: OverviewUnit;
  quantity: number;
  orderCount: number;
  averagePrice: number;
}

export interface ActivityTrendPoint {
  label: string;
  detail: string;
  orderCount: number;
}

export interface CategoryDemandItem {
  category: string;
  orderCount: number;
  orderShare: number;
  activeListings: number;
  listingShare: number;
}

export interface WeekdayDemandItem {
  label: string;
  orderCount: number;
}

export interface MarketplaceOverviewResponse {
  generatedAt: string;
  from: string;
  to: string;
  bucket: OverviewBucket;
  isSampleData: boolean;
  kpis: {
    completedPickups: number;
    produceTypesBought: number;
    activeListings: number;
    pickupRate: number | null;
    quantityByUnit: UnitQuantity[];
  };
  topProduce: TopProduceItem[];
  activityTrends: ActivityTrendPoint[];
  categoryDemand: CategoryDemandItem[];
  weekdayDemand: WeekdayDemandItem[];
}

export const unitWord = (unit: OverviewUnit, quantity = 1) => (unit === "kg" ? "kg" : quantity === 1 ? unit : `${unit}s`);

export const EXPLANATION_KEYS = ["trend", "weekday", "produce", "price", "compare", "bought", "listed", "demand"] as const;
export type ExplanationKey = (typeof EXPLANATION_KEYS)[number];
export type MarketplaceOverviewExplanations = { source: "ai" | "template" } & Record<ExplanationKey, string>;

const queryFor = (from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const text = params.toString();
  return text ? `?${text}` : "";
};

// An API that has not been redeployed yet answers with the old shape; fall back to empty totals so the page still renders.
const emptyKpis: MarketplaceOverviewResponse["kpis"] = { completedPickups: 0, produceTypesBought: 0, activeListings: 0, pickupRate: null, quantityByUnit: [] };

export async function getMarketplaceOverview(from?: string, to?: string, signal?: AbortSignal) {
  const res = await apiRequest<MarketplaceOverviewResponse>(`/marketplace/overview${queryFor(from, to)}`, { signal });
  return {
    ...res,
    kpis: { ...emptyKpis, ...(res.kpis as Partial<MarketplaceOverviewResponse["kpis"]>) },
    topProduce: res.topProduce ?? [],
    activityTrends: res.activityTrends ?? [],
    categoryDemand: res.categoryDemand ?? [],
    weekdayDemand: res.weekdayDemand ?? [],
  };
}

export function getOverviewExplanations(from?: string, to?: string, signal?: AbortSignal) {
  return apiRequest<MarketplaceOverviewExplanations>(`/marketplace/overview/explanations${queryFor(from, to)}`, { signal });
}

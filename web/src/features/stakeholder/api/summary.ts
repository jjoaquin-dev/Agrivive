import { apiRequest } from "@/src/lib/api";

export interface CropCategoryBreakdown {
  category: string;
  activeCount: number;
}

export interface StakeholderTrends {
  daily: { date: string; placed: number; completed: number; pesos: number }[];
  topProduce: { name: string; quantity: number; pesos: number }[];
  totalPesos: number;
  newUsers30d: number;
}

export interface StakeholderSummary {
  trends: StakeholderTrends;
  generatedAt: string;
  users: { sellers: number; buyers: number };
  listings: { total: number; active: number };
  orders: Record<string, number>;
  reports: { total: number };
  cropCategories: CropCategoryBreakdown[];
  rescueMetrics: {
    totalRescuedQty: number;
    fulfillmentRate: number;
  };
}

export function getStakeholderSummary(signal?: AbortSignal) {
  return apiRequest<StakeholderSummary>("/stakeholder/summary", { signal });
}

import { apiRequest } from "@/src/lib/api";

export interface CropCategoryBreakdown {
  category: string;
  activeCount: number;
}

export interface StakeholderSummary {
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

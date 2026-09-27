import { apiRequest } from "@/src/lib/api";

export interface StakeholderSummary {
  generatedAt: string;
  users: { sellers: number; buyers: number };
  listings: { total: number; active: number };
  orders: Record<string, number>;
  reports: { total: number };
}

export function getStakeholderSummary(signal?: AbortSignal) {
  return apiRequest<StakeholderSummary>("/stakeholder/summary", { signal });
}

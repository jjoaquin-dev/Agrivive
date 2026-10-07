import { apiRequest } from "@/src/lib/api";

export interface AdminPerformance {
  users: { sellers: number; buyers: number };
  listings: { total: number; active: number };
  orders: Record<string, number>;
  trust: {
    verifiedEvents: number;
    reportFlags: number;
    evidenceFiles: number;
    noticesPending: number;
    noticesFailed: number;
  };
  trustMonitoring: {
    policyVersion: string;
    weightedPoints: number;
    verifiedEventPoints: number;
    ratingSignals: number;
    writtenFeedbackCount: number;
    verifiedEvents: number;
    allegationFlags: number;
    components: Array<{
      kind: string;
      count: number;
      weight: number;
      points: number;
    }>;
  };
}

export function getAdminPerformance(signal?: AbortSignal) {
  return apiRequest<AdminPerformance>("/admin/performance", { signal });
}

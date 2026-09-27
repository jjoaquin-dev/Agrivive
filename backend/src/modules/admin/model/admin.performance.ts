export type AdminPerformance = {
  users: { sellers: number; buyers: number };
  listings: { total: number; active: number };
  orders: Record<string, number>;
  trust: { verifiedEvents: number; reportFlags: number; evidenceFiles: number; noticesPending: number; noticesFailed: number };
  trustMonitoring: {
    policyVersion: string;
    weightedPoints: number;
    verifiedEvents: number;
    allegationFlags: number;
    components: Array<{ kind: string; count: number; weight: number; points: number }>;
  };
};

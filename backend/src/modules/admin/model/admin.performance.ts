export type AdminPerformance = {
  users: { sellers: number; buyers: number };
  listings: { total: number; active: number };
  orders: Record<string, number>;
  trust: { verifiedEvents: number; reportFlags: number; noticesPending: number; noticesFailed: number };
};

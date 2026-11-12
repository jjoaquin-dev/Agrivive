export interface SellerTrustEvent {
  id: string;
  /** Empty when the record comes from a product question, a chat or a report instead of an order. */
  orderId: string | null;
  kind: string;
  policyVersion: string;
  createdAt: string;
}

export interface SellerTrustNotice {
  id: string;
  /** Empty when the record comes from a product question, a chat or a report instead of an order. */
  orderId: string | null;
  kind: string;
  createdAt: string;
  sentAt: string | null;
}

export interface SellerTrustAction {
  id: string;
  actionType: string;
  weightedPoints: number;
  policyVersion: string;
  reason: string;
  startsAt: string;
  endsAt: string | null;
  revokedAt: string | null;
}

export interface SellerTrustResponse {
  events: SellerTrustEvent[];
  notices: SellerTrustNotice[];
  actions?: SellerTrustAction[];
  monitoring?: {
    policyVersion: string;
    weightedPoints: number;
    verifiedEventPoints: number;
    ratingSignals: number;
    writtenFeedbackCount: number;
    allegationFlags: number;
  };
}

/** What `GET /trust/me` returns: the person's level, score, guidance, ladder and counted events. */
export type MyTrust = {
  score: number; level: string; levelLabel: string; windowDays: number; pausedUntil: string | null;
  guidance: string; serious: string;
  nextLevel: null | { label: string; atPoints: number; pointsToGo: number };
  ladder: { level: string; label: string; fromPoints: number; summary: string }[];
  events: { id: string; kind: string; points: number; what: string; rule: string; createdAt: string; counted: boolean; disputeStatus: string | null; canDispute: boolean; canCorrect: boolean }[];
  seller: null | {
    underWatch: boolean; needsReview: boolean; flags: { kind: string; detail: string | null }[];
    fault: null | { ratePercent: number; faults: number; orders: number; minOrders: number; gatePercent: number; reviewPercent: number };
    rating: null | { bayesian: number; reviews: number };
    trustedSeller: boolean; canBoost: boolean; canList: boolean;
    trustedRequirements: { minRating: number; minCompletedOrders: number; completedOrders: number };
  };
};

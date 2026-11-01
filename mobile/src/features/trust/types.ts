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

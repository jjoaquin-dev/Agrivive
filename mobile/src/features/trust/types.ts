export interface SellerTrustEvent {
  id: string;
  orderId: string;
  kind: string;
  policyVersion: string;
  createdAt: string;
}

export interface SellerTrustNotice {
  id: string;
  orderId: string;
  kind: string;
  createdAt: string;
  sentAt: string | null;
}

export interface SellerTrustResponse {
  events: SellerTrustEvent[];
  notices: SellerTrustNotice[];
  monitoring?: {
    policyVersion: string;
    weightedPoints: number;
    verifiedEventPoints: number;
    ratingSignals: number;
    writtenFeedbackCount: number;
    allegationFlags: number;
  };
}

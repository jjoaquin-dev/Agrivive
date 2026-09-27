import { apiRequest } from "@/src/lib/api";

export type ReportReason = "pickup_problem" | "conduct" | "listing_inaccurate" | "other";

export interface OrderReport {
  id: string;
  orderId: string;
  reporterId: string;
  reason: ReportReason;
  details: string;
  createdAt: string;
}

export interface OrderReportEvidence {
  id: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
  downloadUrl: string;
}

export function createBuyerOrderReport(orderId: string, reason: ReportReason, details: string) {
  return apiRequest<OrderReport>(`/buyer/orders/${encodeURIComponent(orderId)}/report`, {
    method: "POST",
    body: JSON.stringify({ reason, details }),
  });
}

export function uploadOrderReportEvidence(orderId: string, reportId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<{ id: string }>(
    `/buyer/orders/${encodeURIComponent(orderId)}/report/${encodeURIComponent(reportId)}/evidence`,
    {
      method: "POST",
      body: formData,
    },
  );
}

export function listOrderReportEvidence(orderId: string, reportId: string) {
  return apiRequest<OrderReportEvidence[]>(
    `/buyer/orders/${encodeURIComponent(orderId)}/report/${encodeURIComponent(reportId)}/evidence`,
  );
}

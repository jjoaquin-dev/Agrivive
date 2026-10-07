import { apiFetch } from "../../../api/client";

export type SellerReportReason =
  | "pickup_problem"
  | "conduct"
  | "listing_inaccurate"
  | "other";

export interface SellerReport {
  id: string;
  orderId: string;
  reporterId: string;
  subjectId: string;
  reason: SellerReportReason;
  details: string;
  createdAt: string;
}

export interface SellerReportEvidenceAsset {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
}

export async function createSellerOrderReport(
  orderId: string,
  reason: SellerReportReason,
  details: string,
): Promise<SellerReport> {
  return apiFetch<SellerReport>(`/seller/orders/${orderId}/report`, {
    method: "POST",
    body: JSON.stringify({ reason, details }),
  });
}

export async function uploadSellerOrderReportEvidence(
  orderId: string,
  reportId: string,
  asset: SellerReportEvidenceAsset,
  signal?: AbortSignal,
) {
  const form = new FormData();
  form.append("file", {
    uri: asset.uri,
    name: asset.name,
    type: asset.mimeType,
  } as unknown as Blob);

  return apiFetch<{ id: string }>(
    `/seller/orders/${orderId}/report/${reportId}/evidence`,
    { method: "POST", body: form, signal },
  );
}

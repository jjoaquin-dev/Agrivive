import { apiRequest } from "@/src/lib/api";
import type { BuyerNotice } from "../types";

export function listBuyerNotices(signal?: AbortSignal) {
  return apiRequest<BuyerNotice[]>("/buyer/notices", { signal });
}

export function markBuyerNoticeRead(noticeId: string) {
  return apiRequest<BuyerNotice>(`/buyer/notices/${encodeURIComponent(noticeId)}/read`, {
    method: "POST",
  });
}

export function markAllBuyerNoticesRead() {
  return apiRequest<{ updatedCount: number }>("/buyer/notices/read-all", {
    method: "POST",
  });
}

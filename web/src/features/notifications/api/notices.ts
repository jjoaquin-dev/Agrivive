import { apiRequest } from "@/src/lib/api";
import type { BuyerNotice } from "../types";

export async function listBuyerNotices(signal?: AbortSignal) {
  // apiRequest can return null for an empty body; callers expect a list.
  return (await apiRequest<BuyerNotice[] | null>("/buyer/notices", { signal })) ?? [];
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

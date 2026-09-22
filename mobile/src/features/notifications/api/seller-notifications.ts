import { apiFetch } from "../../../api/client";
import type { SellerNotification, SellerNotificationsResponse } from "../types";

export interface FetchSellerNotificationsParams {
  limit?: number;
  cursor?: string;
  unreadOnly?: boolean;
}

export function fetchSellerNotifications(
  params: FetchSellerNotificationsParams = {},
) {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.unreadOnly) query.set("unreadOnly", "true");

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<SellerNotificationsResponse>(`/seller/notifications${suffix}`);
}

export function markSellerNotificationRead(notificationId: string) {
  return apiFetch<SellerNotification>(
    `/seller/notifications/${notificationId}/read`,
    { method: "POST" },
  );
}

export function markAllSellerNotificationsRead() {
  return apiFetch<{ updatedCount: number }>("/seller/notifications/read-all", {
    method: "POST",
  });
}

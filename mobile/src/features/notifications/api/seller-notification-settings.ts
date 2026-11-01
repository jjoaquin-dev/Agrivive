import { apiFetch } from "../../../api/client";
import type { SellerNotificationSettings } from "../types";

export function fetchSellerNotificationSettings() {
  return apiFetch<SellerNotificationSettings>("/seller/notification-settings");
}

export function updateSellerNotificationSettings(changes: Partial<SellerNotificationSettings>) {
  return apiFetch<SellerNotificationSettings>("/seller/notification-settings", {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

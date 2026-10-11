import { apiFetch } from "../../../api/client";

export type NotificationDevicePlatform = "android" | "ios" | "web";

export function registerNotificationDevice(input: {
  platform: NotificationDevicePlatform;
  pushToken: string;
  deviceId?: string;
  notificationsEnabled?: boolean;
}) {
  return apiFetch<{ id: string; platform: NotificationDevicePlatform; isEnabled: boolean }>(
    "/notifications/devices",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function disableNotificationDevice(deviceId: string) {
  return apiFetch<{ id: string; disabled: boolean }>(`/notifications/devices/${deviceId}`, {
    method: "DELETE",
  });
}

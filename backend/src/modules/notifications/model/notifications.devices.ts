import { t } from "elysia";

export const registerNotificationDeviceBody = t.Object({
  platform: t.Union([t.Literal("android"), t.Literal("ios"), t.Literal("web")]),
  pushToken: t.String({ minLength: 1, maxLength: 4096 }),
  deviceId: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  notificationsEnabled: t.Optional(t.Boolean({ default: true })),
});

export const notificationDeviceParams = t.Object({
  id: t.String({ format: "uuid" }),
});

export type RegisterNotificationDeviceBody = typeof registerNotificationDeviceBody.static;

import { and, eq, or } from "drizzle-orm";
import { db } from "../../../db";
import { notification_devices } from "../../../db/schema";
import type { RegisterNotificationDeviceBody } from "../model/notifications.devices";

export async function registerNotificationDevice(userId: string, input: RegisterNotificationDeviceBody) {
  const now = new Date();
  const existing = await db.select({ id: notification_devices.id })
    .from(notification_devices)
    .where(or(
      eq(notification_devices.pushToken, input.pushToken),
      input.deviceId
        ? and(
          eq(notification_devices.userId, userId),
          eq(notification_devices.deviceId, input.deviceId),
        )
        : undefined,
    ))
    .limit(1);

  const [device] = existing.length
    ? await db.update(notification_devices)
      .set({
        userId,
        platform: input.platform,
        pushToken: input.pushToken,
        deviceId: input.deviceId,
        isEnabled: input.notificationsEnabled ?? true,
        lastSeenAt: now,
        invalidatedAt: null,
        updatedAt: now,
      })
      .where(eq(notification_devices.id, existing[0].id))
      .returning({
        id: notification_devices.id,
        platform: notification_devices.platform,
        isEnabled: notification_devices.isEnabled,
        lastSeenAt: notification_devices.lastSeenAt,
      })
    : await db.insert(notification_devices).values({
      userId,
      platform: input.platform,
      pushToken: input.pushToken,
      deviceId: input.deviceId,
      isEnabled: input.notificationsEnabled ?? true,
      lastSeenAt: now,
      createdAt: now,
      updatedAt: now,
    }).returning({
      id: notification_devices.id,
      platform: notification_devices.platform,
      isEnabled: notification_devices.isEnabled,
      lastSeenAt: notification_devices.lastSeenAt,
    });

  return device;
}

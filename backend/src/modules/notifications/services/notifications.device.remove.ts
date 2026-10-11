import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { notification_devices } from "../../../db/schema";
import { NotificationError } from "./notifications.error";

export async function removeNotificationDevice(userId: string, deviceId: string) {
  const [device] = await db.update(notification_devices)
    .set({ isEnabled: false, invalidatedAt: new Date(), updatedAt: new Date() })
    .where(and(
      eq(notification_devices.id, deviceId),
      eq(notification_devices.userId, userId),
    ))
    .returning({ id: notification_devices.id });
  if (!device) throw new NotificationError(404, "Notification device not found");
  return { id: device.id, disabled: true };
}

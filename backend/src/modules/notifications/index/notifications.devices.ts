import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import {
  notificationDeviceParams,
  registerNotificationDeviceBody,
} from "../model/notifications.devices";
import { removeNotificationDevice } from "../services/notifications.device.remove";
import { registerNotificationDevice } from "../services/notifications.device.register";
import { NotificationError } from "../services/notifications.error";

function notificationFailure(error: unknown, status: (code: any, body?: any) => any) {
  if (error instanceof NotificationError) return status(error.statusCode, { message: error.message });
  console.error(error);
  return status(500, { message: "Notification device operation failed" });
}

export const notificationDevicesRoute = new Elysia().use(sessionAuth)
  .post("/notifications/devices", async ({ session, body, status }) => {
    try {
      return status(201, await registerNotificationDevice(session.userId, body));
    } catch (error) {
      return notificationFailure(error, status);
    }
  }, {
    role: ["buyer", "seller"],
    body: registerNotificationDeviceBody,
  })
  .delete("/notifications/devices/:id", async ({ session, params, status }) => {
    try {
      return await removeNotificationDevice(session.userId, params.id);
    } catch (error) {
      return notificationFailure(error, status);
    }
  }, {
    role: ["buyer", "seller"],
    params: notificationDeviceParams,
  });

import Elysia from "elysia";
import { notificationDevicesRoute } from "./index/notifications.devices";

export const notificationsRoute = new Elysia({ name: "notifications" })
  .use(notificationDevicesRoute);

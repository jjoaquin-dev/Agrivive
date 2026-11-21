import Elysia from "elysia";
import { notificationDevicesRoute } from "./index/notifications.devices";
import { notificationsLiveRoute } from "./index/notifications.live";

export const notificationsRoute = new Elysia({ name: "notifications" })
  .use(notificationDevicesRoute)
  .use(notificationsLiveRoute);

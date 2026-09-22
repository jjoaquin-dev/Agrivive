import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import {
  sellerNotificationListQuery,
  sellerNotificationParams,
} from "../model/seller.notifications";
import { listSellerNotifications } from "../services/seller.notifications.list";
import { readSellerNotification } from "../services/seller.notification.read";
import { readAllSellerNotifications } from "../services/seller.notifications.read-all";

function notificationFailure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error(error);
  return status(500, { message: "Notification operation failed" });
}

export const sellerNotificationsRoute = new Elysia().use(sessionAuth)
  .get("/notifications", async ({ session, query, status }) => {
    try {
      return await listSellerNotifications(session.userId, query);
    } catch (error) {
      return notificationFailure(error, status);
    }
  }, {
    role: ["seller"],
    query: sellerNotificationListQuery,
  })
  .post("/notifications/:id/read", async ({ session, params, status }) => {
    try {
      return await readSellerNotification(session.userId, params.id);
    } catch (error) {
      return notificationFailure(error, status);
    }
  }, {
    role: ["seller"],
    params: sellerNotificationParams,
  })
  .post("/notifications/read-all", async ({ session, status }) => {
    try {
      return await readAllSellerNotifications(session.userId);
    } catch (error) {
      return notificationFailure(error, status);
    }
  }, {
    role: ["seller"],
  });

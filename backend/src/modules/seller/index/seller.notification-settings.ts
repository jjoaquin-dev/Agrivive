import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerNotificationSettingsBody } from "../model/seller.notification-settings";
import { getSellerNotificationSettings } from "../services/seller.notification-settings.get";
import { updateSellerNotificationSettings } from "../services/seller.notification-settings.update";

function settingsFailure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error(error);
  return status(500, { message: "Notification settings failed" });
}

export const sellerNotificationSettingsRoute = new Elysia().use(sessionAuth)
  .get("/notification-settings", async ({ session, status }) => {
    try {
      return await getSellerNotificationSettings(session.userId);
    } catch (error) {
      return settingsFailure(error, status);
    }
  }, { role: ["seller"] })
  .patch("/notification-settings", async ({ session, body, status }) => {
    try {
      return await updateSellerNotificationSettings(session.userId, body);
    } catch (error) {
      return settingsFailure(error, status);
    }
  }, { role: ["seller"], body: sellerNotificationSettingsBody });

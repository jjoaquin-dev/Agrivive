import { useEffect } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { registerNotificationDevice } from "../api/notification-devices";
import { DEVICE_ID_KEY } from "../api/deviceKey";
import { getNotificationsModule, isPushNotificationSupported } from "../utils/notificationsModule";
import { emitPushReceived } from "./pushEvents";
import { colors } from "../../../theme";

export function NotificationRegistration() {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    let cancelled = false;
    let removeListener: (() => void) | undefined;

    async function setupLocalNotifications() {
      const Notifications = await getNotificationsModule();
      if (cancelled || !Notifications) return;

      try {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "Agrivive Alerts",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: colors.primaryPressed,
            sound: "default",
          });
          await Notifications.setNotificationChannelAsync("orders", {
            name: "Orders and Messages",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: colors.primaryPressed,
            sound: "default",
          });
          await Notifications.setNotificationChannelAsync("updates", {
            name: "Updates",
            importance: Notifications.AndroidImportance.LOW,
            lightColor: colors.primaryPressed,
          });
        }

        await Notifications.requestPermissionsAsync();

        const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
          const data = response.notification.request.content.data as { path?: unknown };
          if (typeof data.path === "string" && data.path.startsWith("/")) {
            router.push(data.path as never);
          }
        });

        const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
          emitPushReceived(notification.request.content.data);
        });

        removeListener = () => {
          responseSubscription.remove();
          receivedSubscription.remove();
        };
      } catch (err) {
        console.warn("[Push] Error initializing local notification handlers:", err);
      }
    }

    void setupLocalNotifications();

    return () => {
      cancelled = true;
      removeListener?.();
    };
  }, [router]);

  useEffect(() => {
    if (!session?.user?.id || Platform.OS !== "android") return;
    if (!isPushNotificationSupported()) {
      return;
    }

    let cancelled = false;

    async function registerDeviceToken() {
      try {
        const Notifications = await getNotificationsModule();
        if (cancelled || !Notifications) return;

        const token = await Notifications.getDevicePushTokenAsync();
        if (cancelled || !token.data) return;

        const device = await registerNotificationDevice({
          platform: "android",
          pushToken: String(token.data),
          notificationsEnabled: true,
        });
        await SecureStore.setItemAsync(DEVICE_ID_KEY, device.id);
      } catch (error) {
        console.warn("[Push] Remote device registration skipped:", error);
      }
    }

    void registerDeviceToken();
    return () => { cancelled = true; };
  }, [session?.user?.id]);

  return null;
}

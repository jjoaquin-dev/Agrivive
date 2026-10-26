import { useEffect } from "react";
import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { registerNotificationDevice } from "../api/notification-devices";
import { useNotificationWatcher } from "../hooks/useNotificationWatcher";

export function NotificationRegistration() {
  const router = useRouter();
  const { session } = useAuth();
  useNotificationWatcher();

  useEffect(() => {
    if (Platform.OS === "web") return;

    let cancelled = false;
    let removeListener: (() => void) | undefined;

    async function setupLocalNotifications() {
      const Notifications = await import("expo-notifications");
      if (cancelled) return;

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
          lightColor: "#1F4D3A",
          sound: "default",
        });
      }

      await Notifications.requestPermissionsAsync();

      const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as { path?: unknown };
        if (typeof data.path === "string" && data.path.startsWith("/")) {
          router.push(data.path as never);
        }
      });

      removeListener = () => responseSubscription.remove();
    }

    void setupLocalNotifications();

    return () => {
      cancelled = true;
      removeListener?.();
    };
  }, [router]);

  useEffect(() => {
    if (!session?.user?.id || Platform.OS !== "android") return;
    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
      console.log("[Push] Expo Go: Local notifications active. Standalone build required for remote FCM tokens.");
      return;
    }

    let cancelled = false;

    async function registerDeviceToken() {
      try {
        const Notifications = await import("expo-notifications");
        if (cancelled) return;

        const token = await Notifications.getDevicePushTokenAsync();
        if (cancelled || !token.data) return;

        await registerNotificationDevice({
          platform: "android",
          pushToken: String(token.data),
          notificationsEnabled: true,
        });
      } catch (error) {
        console.warn("[Push] Remote device registration skipped:", error);
      }
    }

    void registerDeviceToken();
    return () => { cancelled = true; };
  }, [session?.user?.id]);

  return null;
}

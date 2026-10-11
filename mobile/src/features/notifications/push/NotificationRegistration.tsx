import { useEffect } from "react";
import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { registerNotificationDevice } from "../api/notification-devices";

const canUseNotifications =
  Platform.OS !== "web" &&
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

export function NotificationRegistration() {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (!canUseNotifications) return;

    let cancelled = false;
    let removeListener: (() => void) | undefined;

    async function subscribe() {
      const Notifications = await import("expo-notifications");
      if (cancelled) return;

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: false,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as { path?: unknown };
        if (typeof data.path === "string" && data.path.startsWith("/")) {
          router.push(data.path as never);
        }
      });

      removeListener = () => responseSubscription.remove();
    }

    void subscribe();

    return () => {
      cancelled = true;
      removeListener?.();
    };
  }, [router]);

  useEffect(() => {
    // Expo Go cannot use Android remote push notifications. A development build
    // is required for the native Firebase token flow below.
    if (!session?.user?.id || Platform.OS !== "android" || !canUseNotifications) return;
    let cancelled = false;

    async function register() {
      try {
        const Notifications = await import("expo-notifications");
        if (cancelled) return;

        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
        const current = await Notifications.getPermissionsAsync();
        const permission = current.granted
          ? current
          : await Notifications.requestPermissionsAsync();
        if (!permission.granted || cancelled) return;

        const token = await Notifications.getDevicePushTokenAsync();
        if (cancelled || !token.data) return;
        await registerNotificationDevice({
          platform: "android",
          pushToken: String(token.data),
          notificationsEnabled: true,
        });
      } catch (error) {
        console.warn("Could not register push notifications", error);
      }
    }

    void register();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  return null;
}

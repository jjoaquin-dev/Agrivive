import { Alert, Platform } from "react-native";
import { getNotificationsModule, isExpoGo } from "./notificationsModule";

export async function sendLocalTestNotification(): Promise<void> {
  if (Platform.OS === "web") {
    Alert.alert("Notice", "Notifications are not supported in web mode.");
    return;
  }

  if (isExpoGo()) {
    Alert.alert(
      "Development Build Required",
      "Phone notifications require a native Development Build (npx expo run:android) and are not supported inside Expo Go.",
    );
    return;
  }

  try {
    const Notifications = await getNotificationsModule();
    if (!Notifications) return;

    const { granted } = await Notifications.requestPermissionsAsync();

    if (!granted) {
      Alert.alert(
        "Permission Required",
        "Please allow notifications in your phone's system settings.",
      );
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔔 Agrivive Phone Alert",
        body: "Phone notifications are working! You will be alerted when new reservations, messages, or updates arrive.",
        data: { path: "/(app)/notifications" },
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    Alert.alert(
      "Notification Error",
      error instanceof Error ? error.message : "Failed to trigger alert.",
    );
  }
}

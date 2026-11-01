import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { isRunningInExpoGo } from "expo";

export function isExpoGo(): boolean {
  return (
    isRunningInExpoGo() ||
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
    (Constants as any).appOwnership === "expo"
  );
}

export function isPushNotificationSupported(): boolean {
  if (Platform.OS === "web") return false;
  if (isExpoGo()) return false;
  return true;
}

export async function getNotificationsModule(): Promise<typeof import("expo-notifications") | null> {
  if (!isPushNotificationSupported()) {
    return null;
  }

  try {
    const mod = await import("expo-notifications");
    if (!mod || typeof mod.setNotificationHandler !== "function") {
      return null;
    }
    return mod;
  } catch (error) {
    console.warn("[Push] Native expo-notifications module unavailable in this environment:", error);
    return null;
  }
}

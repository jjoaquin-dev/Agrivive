import * as WebBrowser from "expo-web-browser";

// Bump with web/src/features/legal/content/version.ts when the legal text changes.
export const LEGAL_VERSION = "2026-11-02";

const webUrl = (process.env.EXPO_PUBLIC_WEB_URL ?? "https://agrivive.tech").replace(/\/$/, "");

export function openLegalPage(page: "privacy" | "terms") {
  return WebBrowser.openBrowserAsync(`${webUrl}/${page}`);
}

export { webUrl };

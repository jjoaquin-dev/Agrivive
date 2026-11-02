import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient, twoFactorClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { Platform } from "react-native";

export function getApiBaseUrl(): string {
  // When using tunnel mode or a remote HTTPS API, prefer the configured API URL
  if (process.env.EXPO_PUBLIC_API_URL && !process.env.EXPO_PUBLIC_API_URL.includes("localhost")) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }

  // In development / Expo Go, dynamically use Metro host IP so Wi-Fi changes work seamlessly
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri && !hostUri.includes("exp.direct")) {
    const host = hostUri.split(":")[0];
    return `http://${host}:3000`;
  }

  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }

  // Production fallback for standalone builds
  return "https://api.agrivive.tech";
}

export const authClient = createAuthClient({
  baseURL: getApiBaseUrl(),
  plugins: [
    expoClient({
      scheme: "agrivive",
      storage: SecureStore,
    }),
    emailOTPClient(),
    twoFactorClient(),
  ],
});

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_TIMEOUT_MS = 10_000;

/** Called when the server says this account is paused or blocked, so the app can show that screen from anywhere. */
let accountClosedHandler: ((message: string) => void) | null = null;
export function setAccountClosedHandler(handler: ((message: string) => void) | null) {
  accountClosedHandler = handler;
}
const accountClosedText = /restore your account|come back in/i;

/** Logs a failed load; a paused or blocked account is expected, so it gets a quiet warning instead of a red error. */
export function logApiError(label: string, err: unknown) {
  if (err instanceof ApiError && err.statusCode === 403 && accountClosedText.test(err.message)) {
    console.warn(label, "- account is not open");
    return;
  }
  console.error(label, err);
}

function createRequestController(signal?: AbortSignal | null, timeoutMs = API_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const cancel = () => controller.abort();

  if (signal?.aborted) cancel();
  else signal?.addEventListener("abort", cancel, { once: true });

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", cancel);
    },
  };
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
  timeoutMs = API_TIMEOUT_MS,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  let cookieHeader = "";
  try {
    cookieHeader = await authClient.getCookie();
  } catch (e) {
    // Ignore cookie retrieval failure if none exists
  }

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(cookieHeader ? { cookie: cookieHeader } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const request = createRequestController(options.signal, timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: request.signal,
      headers,
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (isJson && data?.message) ||
        (typeof data === "string" && data) ||
        `Request failed with status ${response.status}`;
      if (response.status === 403 && accountClosedText.test(String(errorMessage))) accountClosedHandler?.(String(errorMessage));
      throw new ApiError(response.status, errorMessage, data);
    }

    return data as T;
  } catch (error) {
    if (request.signal.aborted && !options.signal?.aborted) {
      throw new ApiError(
        408,
        "Could not connect to Agrivive. Check that the backend is running and your phone is on the same Wi-Fi.",
      );
    }
    throw error;
  } finally {
    request.cleanup();
  }
}

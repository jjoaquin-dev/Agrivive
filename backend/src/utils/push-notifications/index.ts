import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging, type BatchResponse, type MulticastMessage } from "firebase-admin/messaging";

export type PushNotificationMessage = {
  token: string;
  title: string;
  body: string;
  data: Record<string, string>;
};

export type PushNotificationResult = {
  configured: boolean;
  successCount: number;
  invalidTokens: string[];
  retryable: boolean;
  error?: string;
};

function isConfigured() {
  return process.env.PUSH_NOTIFICATIONS_ENABLED === "true"
    && Boolean(process.env.FCM_PROJECT_ID)
    && Boolean(process.env.FCM_CLIENT_EMAIL)
    && Boolean(process.env.FCM_PRIVATE_KEY);
}

function getFirebaseMessaging() {
  const app = getApps()[0] ?? initializeApp({
    credential: cert({
      projectId: process.env.FCM_PROJECT_ID,
      clientEmail: process.env.FCM_CLIENT_EMAIL,
      privateKey: process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
  return getMessaging(app);
}

function isInvalidTokenError(error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code)
    : "";
  return code.includes("registration-token-not-registered")
    || code.includes("invalid-registration-token")
    || code.includes("invalid-argument");
}

export async function sendPushNotificationBatch(messages: PushNotificationMessage[]): Promise<PushNotificationResult> {
  if (!messages.length) {
    return { configured: true, successCount: 0, invalidTokens: [], retryable: false };
  }
  if (!isConfigured()) {
    return {
      configured: false,
      successCount: 0,
      invalidTokens: [],
      retryable: false,
      error: "Push notifications are not configured",
    };
  }

  try {
    const first = messages[0];
    const multicast: MulticastMessage = {
      tokens: messages.map((message) => message.token),
      notification: { title: first.title, body: first.body },
      data: first.data,
      android: {
        priority: "high",
        collapseKey: first.data.collapseKey,
        notification: { channelId: first.data.channelId || "default" },
      },
      apns: {
        headers: first.data.collapseKey ? { "apns-collapse-id": first.data.collapseKey } : undefined,
      },
    };
    const response: BatchResponse = await getFirebaseMessaging().sendEachForMulticast(multicast);
    const invalidTokens = response.responses
      .map((result, index) => result.success || !isInvalidTokenError(result.error) ? null : messages[index].token)
      .filter((token): token is string => Boolean(token));
    const retryable = response.failureCount > 0 && response.successCount === 0 && invalidTokens.length !== response.failureCount;
    return {
      configured: true,
      successCount: response.successCount,
      invalidTokens,
      retryable,
    };
  } catch (error) {
    return {
      configured: true,
      successCount: 0,
      invalidTokens: [],
      retryable: true,
      error: error instanceof Error ? error.message : "Push provider request failed",
    };
  }
}

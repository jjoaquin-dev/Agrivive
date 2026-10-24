import { File } from "expo-file-system";
import { apiFetch, authClient, getApiBaseUrl } from "../../api/client";
import type { Conversation, ConversationContext, ConversationCreateResult, ConversationMessage } from "./types";

export function fetchConversations() {
  return apiFetch<Conversation[]>("/conversations?limit=100");
}

export function fetchConversationMessages(conversationId: string) {
  return apiFetch<ConversationMessage[]>(`/conversations/${encodeURIComponent(conversationId)}/messages`);
}

export function createConversation(input: {
  contextType: ConversationContext;
  productId?: string;
  orderId?: string;
  sellerId?: string;
  message: string;
  clientMessageId: string;
}) {
  return apiFetch<ConversationCreateResult>("/conversations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function sendConversationMessage(conversationId: string, message: string, clientMessageId: string) {
  return apiFetch<ConversationMessage>(`/conversations/${encodeURIComponent(conversationId)}/messages`, {
    method: "POST",
    body: JSON.stringify({ message, clientMessageId }),
  });
}

export function markConversationRead(conversationId: string) {
  return apiFetch(`/conversations/${encodeURIComponent(conversationId)}/read`, { method: "POST" });
}

export function markAllConversationsRead() {
  return apiFetch<{ updatedCount: number }>("/conversations/read-all", { method: "POST" });
}

export async function uploadConversationAttachment(imageUri: string): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", new File(imageUri));

  return apiFetch<{ url: string; filename: string }>("/conversations/attachment", {
    method: "POST",
    body: formData,
  });
}

export async function openConversationSocket(
  conversationId: string,
  onMessage: (message: ConversationMessage) => void,
  onError: () => void,
) {
  const cookie = await authClient.getCookie().catch(() => "");
  const session = await authClient.getSession();
  const token = session.data?.session?.token;
  const url = `${getApiBaseUrl().replace(/^http/, "ws")}/ws/conversations?conversationId=${encodeURIComponent(conversationId)}`;
  const WebSocketWithHeaders = WebSocket as unknown as new (url: string, protocols: string[], options: { headers: Record<string, string> }) => WebSocket;
  const socket = new WebSocketWithHeaders(url, [], {
    headers: {
      ...(cookie ? { cookie } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(String(event.data)) as { type?: string; message?: ConversationMessage };
      if (payload.type === "conversation.message.created" && payload.message) onMessage(payload.message);
    } catch {
      onError();
    }
  };
  socket.onerror = onError;
  return socket;
}

import { File } from "expo-file-system";
import { shrinkImage } from "../../../utils/shrinkImage";
import { apiFetch, authClient, getApiBaseUrl, UPLOAD_TIMEOUT_MS } from "../../../api/client";
import type { Conversation, ConversationContext, ConversationCreateResult, ConversationMessage } from "../types";

export interface FetchConversationsParams {
  limit?: number;
  cursor?: string;
  archived?: boolean;
}

export interface FetchConversationsResponse {
  items: Conversation[];
  nextCursor: string | null;
}

export async function fetchConversations(params: FetchConversationsParams = {}): Promise<FetchConversationsResponse> {
  const qs = new URLSearchParams({ as: "seller" });
  if (params.limit) qs.append("limit", params.limit.toString());
  if (params.cursor) qs.append("cursor", params.cursor);
  if (params.archived) qs.append("archived", "true");
  const query = qs.toString();
  const res = await apiFetch<Conversation[] | FetchConversationsResponse>(`/conversations${query ? `?${query}` : ""}`);
  if (Array.isArray(res)) {
    return { items: res, nextCursor: null };
  }
  return res;
}

export function fetchConversationMessages(conversationId: string) {
  return apiFetch<ConversationMessage[]>(`/conversations/${encodeURIComponent(conversationId)}/messages`);
}

export function fetchConversation(id: string) {
  return apiFetch<Conversation>(`/conversations/${encodeURIComponent(id)}?as=seller`);
}

export function fetchConversationUnreadCount() {
  return apiFetch<{ unreadMessages: number; unreadConversations: number }>("/conversations/unread-count?as=seller");
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

export function setConversationArchived(conversationId: string, archived: boolean) {
  return apiFetch<{ ok: true }>(`/conversations/${encodeURIComponent(conversationId)}/${archived ? "archive" : "unarchive"}`, { method: "POST" });
}

export function setConversationBlocked(conversationId: string, blocked: boolean) {
  return apiFetch<{ ok: true }>(`/conversations/${encodeURIComponent(conversationId)}/${blocked ? "block" : "unblock"}`, { method: "POST" });
}

export function markAllConversationsRead() {
  return apiFetch<{ updatedCount: number }>("/conversations/read-all?as=seller", { method: "POST" });
}

export async function uploadConversationAttachment(imageUri: string, signal?: AbortSignal): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", new File(await shrinkImage(imageUri)));

  return apiFetch<{ url: string; filename: string }>("/conversations/attachment", {
    method: "POST",
    body: formData,
    signal,
  }, UPLOAD_TIMEOUT_MS);
}

export async function openConversationSocket(
  conversationId: string,
  handlers: {
    onMessage: (message: ConversationMessage) => void;
    onConnected?: () => void;
    onClose: () => void;
    onError: () => void;
  },
) {
  const { onMessage, onConnected, onClose, onError } = handlers;
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
      if (payload.type === "conversation.connected") onConnected?.();
      if (payload.type === "conversation.message.created" && payload.message) onMessage(payload.message);
    } catch {
      onError();
    }
  };
  socket.onerror = onError;
  socket.onclose = onClose;
  return socket;
}

import { apiPath, apiRequest } from "@/src/lib/api";

export type ConversationContext = "product" | "order" | "seller";

export type Conversation = {
  id: string;
  contextType: ConversationContext;
  productId: string | null;
  orderId: string | null;
  buyerId: string;
  sellerId: string;
  status: "open" | "closed";
  lastMessageAt: string;
  createdAt: string;
  productName: string | null;
  productImageUrl: string | null;
  productPrice?: string | number | null;
  scalingType?: string | null;
  productQty?: string | number | null;
  sellerName: string;
  sellerImage: string | null;
  sellerShopName: string | null;
  lastMessageBody: string | null;
  unreadCount: number;
};

export type ConversationMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  clientMessageId: string;
  body: string;
  createdAt: string;
};

type ConversationResult = { conversation: Conversation; message: ConversationMessage };

export async function listConversations(signal?: AbortSignal): Promise<Conversation[]> {
  const res = await apiRequest<Conversation[] | { items: Conversation[]; nextCursor: string | null }>("/conversations?limit=100", { signal });
  return Array.isArray(res) ? res : res.items;
}

export function createConversation(input: {
  contextType: ConversationContext;
  productId?: string;
  orderId?: string;
  sellerId?: string;
  message: string;
  clientMessageId: string;
}) {
  return apiRequest<ConversationResult>("/conversations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listConversationMessages(conversationId: string, signal?: AbortSignal) {
  return apiRequest<ConversationMessage[]>(`/conversations/${encodeURIComponent(conversationId)}/messages`, { signal });
}

export function sendConversationMessage(conversationId: string, message: string, clientMessageId: string, productId?: string) {
  return apiRequest<ConversationMessage>(`/conversations/${encodeURIComponent(conversationId)}/messages`, {
    method: "POST",
    body: JSON.stringify({ message, clientMessageId, ...(productId ? { productId } : {}) }),
  });
}

export function markConversationRead(conversationId: string) {
  return apiRequest(`/conversations/${encodeURIComponent(conversationId)}/read`, { method: "POST" });
}

export function uploadConversationAttachment(file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<{ url: string; filename: string }>("/conversations/attachment", {
    method: "POST",
    body,
  });
}

export function conversationWebSocketUrl(conversationId: string) {
  const url = new URL(apiPath(`/ws/conversations?conversationId=${encodeURIComponent(conversationId)}`));
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

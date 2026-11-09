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
  productImageUrl?: string | null;
  sellerName: string;
  sellerShopName: string | null;
  sellerImage: string | null;
  buyerName?: string | null;
  buyerImage?: string | null;
  lastMessageBody: string | null;
  lastMessageSenderId?: string | null;
  unreadCount: number;
  /** When you archived this chat. Set only if you did it. */
  archivedAt?: string | null;
  /** When you blocked this chat. Set only if you did it. */
  myBlockedAt?: string | null;
  /** True when either person blocked the chat. */
  blocked?: boolean;
};

export type ConversationMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  clientMessageId: string;
  body: string;
  createdAt: string;
};

export type ConversationCreateResult = {
  conversation: Conversation;
  message: ConversationMessage;
};

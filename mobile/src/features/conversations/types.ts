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
  sellerName: string;
  sellerShopName: string | null;
  sellerImage: string | null;
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

export type ConversationCreateResult = {
  conversation: Conversation;
  message: ConversationMessage;
};

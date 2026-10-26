import type { Conversation, ConversationContext } from "./api";

export type ConversationLaunchContext = {
  contextType: ConversationContext;
  contextId: string;
  sellerId: string;
  sellerName: string;
  sellerShopName: string | null;
  sellerImage: string | null;
  productId: string | null;
  productName: string | null;
  productImageUrl: string | null;
  productPrice?: string | number | null;
  scalingType?: string | null;
  productQty?: string | number | null;
};

export function conversationContextId(item: Conversation) {
  if (item.contextType === "product") return item.productId ?? "";
  if (item.contextType === "seller") return item.sellerId;
  return item.orderId ?? "";
}

export function launchContextFromConversation(item: Conversation): ConversationLaunchContext {
  return {
    contextType: item.contextType,
    contextId: conversationContextId(item),
    sellerId: item.sellerId,
    sellerName: item.sellerName,
    sellerShopName: item.sellerShopName,
    sellerImage: item.sellerImage,
    productId: item.productId,
    productName: item.productName,
    productImageUrl: item.productImageUrl,
    productPrice: item.productPrice,
    scalingType: item.scalingType,
    productQty: item.productQty,
  };
}

import { t } from "elysia";

export const conversationParams = t.Object({
  id: t.String({ format: "uuid" }),
});

export const conversationListQuery = t.Object({
  limit: t.Optional(t.Integer({ minimum: 1, maximum: 100, default: 50 })),
});

export const createConversationBody = t.Object({
  contextType: t.Union([t.Literal("product"), t.Literal("order"), t.Literal("seller")]),
  productId: t.Optional(t.String({ format: "uuid" })),
  orderId: t.Optional(t.String({ format: "uuid" })),
  sellerId: t.Optional(t.String()),
  message: t.String({ minLength: 1, maxLength: 2000 }),
  clientMessageId: t.String({ minLength: 1, maxLength: 100 }),
});

export const sendConversationMessageBody = t.Object({
  message: t.String({ minLength: 1, maxLength: 2000 }),
  clientMessageId: t.String({ minLength: 1, maxLength: 100 }),
});

export type CreateConversationBody = typeof createConversationBody.static;
export type SendConversationMessageBody = typeof sendConversationMessageBody.static;

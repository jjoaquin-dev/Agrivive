import { t } from "elysia";

export const conversationParams = t.Object({
  id: t.String({ format: "uuid" }),
});

export const conversationSideQuery = t.Object({
  as: t.Optional(t.Union([t.Literal("buyer"), t.Literal("seller")])),
});

export const conversationListQuery = t.Object({
  as: t.Optional(t.Union([t.Literal("buyer"), t.Literal("seller")])),
  limit: t.Optional(t.Integer({ minimum: 1, maximum: 100, default: 50 })),
  cursor: t.Optional(t.String()),
  archived: t.Optional(t.Boolean()),
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
  productId: t.Optional(t.String({ format: "uuid" })),
});

export type CreateConversationBody = typeof createConversationBody.static;
export type SendConversationMessageBody = typeof sendConversationMessageBody.static;

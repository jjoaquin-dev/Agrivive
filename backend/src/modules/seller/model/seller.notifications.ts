import { t } from "elysia";

export const sellerNotificationListQuery = t.Object({
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50, default: 20 })),
  cursor: t.Optional(t.String({ format: "uuid" })),
  unreadOnly: t.Optional(t.Boolean()),
});

export const sellerNotificationParams = t.Object({
  id: t.String({ format: "uuid" }),
});

export type SellerNotificationListQuery = typeof sellerNotificationListQuery.static;

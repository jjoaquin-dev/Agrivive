import { t } from "elysia";

export const sellerNotificationSettingsBody = t.Object({
  stockPrice: t.Optional(t.Boolean()),
  boost: t.Optional(t.Boolean()),
  account: t.Optional(t.Boolean()),
  nightMode: t.Optional(t.Boolean()),
});

export type SellerNotificationSettingsBody = typeof sellerNotificationSettingsBody.static;

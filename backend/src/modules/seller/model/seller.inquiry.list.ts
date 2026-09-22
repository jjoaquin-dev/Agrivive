import { t } from "elysia";

export const sellerInquiryListQuery = t.Object({
  status: t.Optional(t.Union([t.Literal("open"), t.Literal("all")])),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50, default: 20 })),
  cursor: t.Optional(t.String({ format: "uuid" })),
});

export type SellerInquiryListQuery = typeof sellerInquiryListQuery.static;

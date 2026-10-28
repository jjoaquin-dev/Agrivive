import { t } from "elysia";

export const sellerReviewParams = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerReviewResponseBody = t.Object({ response: t.String({ minLength: 1, maxLength: 2000 }) });
export type SellerReviewResponseBody = typeof sellerReviewResponseBody.static;

export const sellerReviewsQuery = t.Object({
  filter: t.Optional(t.Union([t.Literal("all"), t.Literal("unanswered"), t.Literal("replied")])),
  rating: t.Optional(t.Numeric({ minimum: 1, maximum: 5 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50, default: 20 })),
  offset: t.Optional(t.Numeric({ minimum: 0, default: 0 })),
});
export type SellerReviewsQuery = typeof sellerReviewsQuery.static;

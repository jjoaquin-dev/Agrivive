import { t } from "elysia";

export const buyerReviewParams = t.Object({ id: t.String({ format: "uuid" }) });
export const buyerReviewBody = t.Object({
  rating: t.Integer({ minimum: 1, maximum: 5 }),
  review: t.Optional(t.String({ maxLength: 2000 })),
});
export type BuyerReviewBody = typeof buyerReviewBody.static;

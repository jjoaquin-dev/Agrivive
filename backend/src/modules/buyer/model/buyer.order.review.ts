import { t } from "elysia";

export const buyerReviewParams = t.Object({ id: t.String({ format: "uuid" }) });
export const buyerReviewBody = t.Object({
  rating: t.Integer({ minimum: 1, maximum: 5 }),
  review: t.Optional(t.String({ maxLength: 2000 })),
});
export type BuyerReviewBody = typeof buyerReviewBody.static;

export const buyerProductReviewParams = t.Object({
  id: t.String({ format: "uuid" }),
  itemId: t.String({ format: "uuid" }),
});

export const buyerProductReviewEligibilityParams = t.Object({
  id: t.String({ format: "uuid" }),
});

export const buyerProductReviewBody = t.Object({
  rating: t.Integer({ minimum: 1, maximum: 5 }),
  review: t.Optional(t.String({ maxLength: 2000 })),
});

export type BuyerProductReviewBody = typeof buyerProductReviewBody.static;

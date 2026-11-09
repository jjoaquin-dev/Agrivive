import { t } from "elysia";

export const buyerReviewParams = t.Object({ id: t.String({ format: "uuid" }) });

const stars = t.Integer({ minimum: 1, maximum: 5 });

/** One review per order: product stars, service stars, one optional comment. */
export const buyerReviewBody = t.Object({
  productRating: stars,
  serviceRating: stars,
  review: t.Optional(t.String({ maxLength: 2000 })),
});
export type BuyerReviewBody = typeof buyerReviewBody.static;

/** Same fields, all optional. At least one is required by the service. */
export const buyerReviewEditBody = t.Object({
  productRating: t.Optional(stars),
  serviceRating: t.Optional(stars),
  review: t.Optional(t.String({ maxLength: 2000 })),
});
export type BuyerReviewEditBody = typeof buyerReviewEditBody.static;

export const buyerReviewPhotoBody = t.Object({
  file: t.File({ type: ["image/jpeg", "image/png", "image/webp"], maxSize: 5 * 1024 * 1024 }),
});

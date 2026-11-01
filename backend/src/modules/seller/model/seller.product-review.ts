import { t } from "elysia";

export const sellerProductReviewParams = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerProductReviewResponseBody = t.Object({ response: t.String({ minLength: 1, maxLength: 2000 }) });
export type SellerProductReviewResponseBody = typeof sellerProductReviewResponseBody.static;

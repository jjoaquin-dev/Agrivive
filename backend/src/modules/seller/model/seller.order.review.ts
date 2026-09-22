import { t } from "elysia";

export const sellerReviewParams = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerReviewResponseBody = t.Object({ response: t.String({ minLength: 1, maxLength: 2000 }) });
export type SellerReviewResponseBody = typeof sellerReviewResponseBody.static;

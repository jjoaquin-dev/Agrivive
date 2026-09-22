import { t } from "elysia";

export const sellerCancelParams = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerCancelBody = t.Object({ reason: t.String({ minLength: 5, maxLength: 500 }) });
export type SellerCancelBody = typeof sellerCancelBody.static;

import { t } from "elysia";

export const sellerTrustEventParams = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerCorrectionBody = t.Object({ reason: t.String({ minLength: 5, maxLength: 2000 }) });
export type SellerCorrectionBody = typeof sellerCorrectionBody.static;

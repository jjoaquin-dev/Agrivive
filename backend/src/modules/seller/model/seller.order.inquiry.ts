import { t } from "elysia";

export const sellerInquiryParams = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerInquiryReplyBody = t.Object({ reply: t.String({ minLength: 1, maxLength: 1000 }) });
export type SellerInquiryReplyBody = typeof sellerInquiryReplyBody.static;

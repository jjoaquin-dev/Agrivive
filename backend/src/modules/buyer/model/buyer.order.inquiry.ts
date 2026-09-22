import { t } from "elysia";

export const buyerInquiryParams = t.Object({ id: t.String({ format: "uuid" }) });
export const buyerInquiryBody = t.Object({ question: t.String({ minLength: 1, maxLength: 1000 }) });
export type BuyerInquiryBody = typeof buyerInquiryBody.static;

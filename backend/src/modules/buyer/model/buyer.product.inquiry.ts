import { t } from "elysia";

export const buyerProductInquiryParams = t.Object({ id: t.String({ format: "uuid" }) });
export const buyerProductInquiryBody = t.Object({
  question: t.String({ minLength: 1, maxLength: 1000 }),
});

export type BuyerProductInquiryBody = typeof buyerProductInquiryBody.static;

import { t } from "elysia";

export const sellerProductInquiryParams = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerProductInquiryReply = t.Object({ reply: t.String({ minLength: 1, maxLength: 1000 }) });
export type SellerProductInquiryQuery = {
  status?: "open" | "all";
  limit?: number;
  cursor?: string;
};

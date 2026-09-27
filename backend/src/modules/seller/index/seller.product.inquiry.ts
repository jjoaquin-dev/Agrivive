import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerInquiryListQuery } from "../model/seller.inquiry.list";
import { sellerProductInquiryParams, sellerProductInquiryReply } from "../model/seller.product.inquiry";
import { listSellerProductInquiries } from "../services/seller.product.inquiry.list";
import { replySellerProductInquiry } from "../services/seller.product.inquiry.reply";

export const sellerProductInquiryRoute = new Elysia().use(sessionAuth)
  .get("/product-inquiries", async ({ session, query, status }) => {
    try { return await listSellerProductInquiries(session.userId, query); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to list product questions" });
    }
  }, { role: ["seller"], query: sellerInquiryListQuery })
  .post("/product-inquiries/:id/reply", async ({ session, params, body, status }) => {
    try { return await replySellerProductInquiry(session.userId, params.id, body.reply); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to reply to product question" });
    }
  }, { role: ["seller"], params: sellerProductInquiryParams, body: sellerProductInquiryReply });

import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { listOrderInquiries } from "../../../utils/trust";
import { sellerInquiryParams, sellerInquiryReplyBody } from "../model/seller.order.inquiry";
import { replySellerInquiry } from "../services/seller.order.inquiry.reply";

export const sellerInquiryRoute = new Elysia().use(sessionAuth)
  .get("/orders/:id/inquiries", async ({ session, params, status }) => {
    try { return await listOrderInquiries(session.userId, params.id, "seller"); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to list inquiries" });
    }
  }, { role: ["seller"], params: sellerInquiryParams })
  .post("/inquiries/:id/reply", async ({ session, params, body, status }) => {
    try { return await replySellerInquiry(session.userId, params.id, body.reply); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to reply" });
    }
  }, { role: ["seller"], params: sellerInquiryParams, body: sellerInquiryReplyBody });

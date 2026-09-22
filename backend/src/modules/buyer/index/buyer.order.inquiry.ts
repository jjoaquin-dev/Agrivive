import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { listOrderInquiries } from "../../../utils/trust";
import { buyerInquiryBody, buyerInquiryParams } from "../model/buyer.order.inquiry";
import { createBuyerInquiry } from "../services/buyer.order.inquiry.create";

export const buyerInquiryRoute = new Elysia().use(sessionAuth)
  .get("/orders/:id/inquiries", async ({ session, params, status }) => {
    try { return await listOrderInquiries(session.userId, params.id, "buyer"); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to list inquiries" });
    }
  }, { role: ["buyer"], params: buyerInquiryParams })
  .post("/orders/:id/inquiries", async ({ session, params, body, status }) => {
    try { return status(201, await createBuyerInquiry(session.userId, params.id, body.question)); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to create inquiry" });
    }
  }, { role: ["buyer"], params: buyerInquiryParams, body: buyerInquiryBody });

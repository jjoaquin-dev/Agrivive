import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { buyerProductInquiryBody, buyerProductInquiryParams } from "../model/buyer.product.inquiry";
import { createBuyerProductInquiry } from "../services/buyer.product.inquiry.create";
import { listBuyerProductInquiries } from "../services/buyer.product.inquiry.read";

export const buyerProductInquiryRoute = new Elysia().use(sessionAuth)
  .get("/products/:id/inquiries", async ({ session, params, status }) => {
    try { return await listBuyerProductInquiries(session.userId, params.id); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to list product questions" });
    }
  }, { role: ["buyer"], params: buyerProductInquiryParams })
  .post("/products/:id/inquiries", async ({ session, params, body, status }) => {
    try { return status(201, await createBuyerProductInquiry(session.userId, params.id, body.question)); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to send product question" });
    }
  }, { role: ["buyer"], params: buyerProductInquiryParams, body: buyerProductInquiryBody });

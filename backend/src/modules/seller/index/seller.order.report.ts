import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerReportBody, sellerReportParams } from "../model/seller.order.report";
import { createSellerOrderReport } from "../services/seller.order.report";

export const sellerReportRoute = new Elysia().use(sessionAuth).post("/orders/:id/report",
  async ({ session, params, body, status }) => {
    try { return status(201, await createSellerOrderReport(session.userId, params.id, body)); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to report order" });
    }
  }, { role: ["seller"], params: sellerReportParams, body: sellerReportBody });

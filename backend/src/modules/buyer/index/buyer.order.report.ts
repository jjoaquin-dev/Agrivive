import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { buyerReportBody, buyerReportParams } from "../model/buyer.order.report";
import { createBuyerOrderReport } from "../services/buyer.order.report";

export const buyerReportRoute = new Elysia().use(sessionAuth).post("/orders/:id/report",
  async ({ session, params, body, status }) => {
    try { return status(201, await createBuyerOrderReport(session.userId, params.id, body)); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to report order" });
    }
  }, { role: ["buyer"], params: buyerReportParams, body: buyerReportBody });

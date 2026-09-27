import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerReportBody, sellerReportParams } from "../model/seller.order.report";
import { createSellerOrderReport } from "../services/seller.order.report";
import { sellerReportEvidenceParams, sellerReportEvidenceUpload } from "../model/seller.order.report.evidence";
import { uploadOrderReportEvidence } from "../../../utils/trust/report-evidence.upload";
import { listOrderReportEvidence } from "../../../utils/trust/report-evidence.list";

export const sellerReportRoute = new Elysia().use(sessionAuth)
  .post("/orders/:id/report", async ({ session, params, body, status }) => {
    try { return status(201, await createSellerOrderReport(session.userId, params.id, body)); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to report order" });
    }
  }, { role: ["seller"], params: sellerReportParams, body: sellerReportBody })
  .post("/orders/:id/report/:reportId/evidence", async ({ session, params, body, status }) => {
    try { return status(201, await uploadOrderReportEvidence(session.userId, params.id, params.reportId, body.file)); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to upload report evidence" });
    }
  }, { role: ["seller"], params: sellerReportEvidenceParams, body: sellerReportEvidenceUpload })
  .get("/orders/:id/report/:reportId/evidence", async ({ session, params, status }) => {
    try { return await listOrderReportEvidence(session.userId, params.id, params.reportId); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to read report evidence" });
    }
  }, { role: ["seller"], params: sellerReportEvidenceParams });

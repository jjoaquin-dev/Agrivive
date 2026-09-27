import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { order_report_evidence, order_reports } from "../../db/schema";
import { OrderError } from "../order-types";
import { createPrivateDownloadUrl } from "../s3/private-download";

export async function listOrderReportEvidence(userId: string, orderId: string, reportId: string) {
  const [report] = await db.select({ id: order_reports.id }).from(order_reports).where(and(
    eq(order_reports.id, reportId), eq(order_reports.orderId, orderId), eq(order_reports.reporterId, userId),
  )).limit(1);
  if (!report) throw new OrderError(404, "Report not found");
  const files = await db.select().from(order_report_evidence)
    .where(eq(order_report_evidence.reportId, reportId)).orderBy(asc(order_report_evidence.createdAt));
  return Promise.all(files.map(async (file) => ({
    id: file.id,
    contentType: file.contentType,
    sizeBytes: file.sizeBytes,
    createdAt: file.createdAt,
    downloadUrl: await createPrivateDownloadUrl(file.objectKey),
  })));
}

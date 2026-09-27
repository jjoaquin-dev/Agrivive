import { and, count, eq } from "drizzle-orm";
import { db } from "../../db";
import { order_report_evidence, order_reports } from "../../db/schema";
import { OrderError } from "../order-types";
import { uploadPrivateObject } from "../s3/private-upload";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export async function uploadOrderReportEvidence(userId: string, orderId: string, reportId: string, file: File) {
  if (!file || !allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024) {
    throw new OrderError(400, "Use a JPG, PNG, WebP, or PDF file under 5 MB");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const validHeader = file.type === "image/jpeg" ? buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
    : file.type === "image/png" ? buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : file.type === "image/webp" ? buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP"
    : buffer.toString("ascii", 0, 4) === "%PDF";
  if (!validHeader) throw new OrderError(400, "The file content does not match its file type");
  const extension = file.type === "application/pdf" ? "pdf" : file.type.split("/")[1];
  const key = `private-reports/${orderId}/${reportId}/${crypto.randomUUID()}.${extension}`;
  return db.transaction(async (tx) => {
    const [report] = await tx.select({ id: order_reports.id }).from(order_reports).where(and(
      eq(order_reports.id, reportId), eq(order_reports.orderId, orderId), eq(order_reports.reporterId, userId),
    )).for("update").limit(1);
    if (!report) throw new OrderError(404, "Report not found");
    const [total] = await tx.select({ value: count() }).from(order_report_evidence)
      .where(eq(order_report_evidence.reportId, reportId));
    if (Number(total?.value ?? 0) >= 5) throw new OrderError(409, "A report can have up to five evidence files");
    await uploadPrivateObject({ buffer, key, contentType: file.type });
    const [evidence] = await tx.insert(order_report_evidence).values({
      reportId, objectKey: key, contentType: file.type, sizeBytes: file.size,
    }).returning({ id: order_report_evidence.id, contentType: order_report_evidence.contentType,
      sizeBytes: order_report_evidence.sizeBytes, createdAt: order_report_evidence.createdAt });
    return evidence;
  });
}

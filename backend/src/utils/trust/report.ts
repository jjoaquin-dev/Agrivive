import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { order_reports, orders } from "../../db/schema";
import { requireActiveUser } from "../order-access";
import { OrderError, type OrderSide } from "../order-types";
import { notifyBuyer } from "../pickup/notify";
import { confirmReportedViolation } from "./confirm-report";
import { recordFakeReportsIfCounted } from "./fake-reports";
import { evaluateTrustAction } from "./evaluate-action";
import { recordTrustEvent } from "./index";

export const REPORT_MIN_DETAILS = 20;

/**
 * A report is an allegation worth 0 points. Details need 20 characters, one report per order per person, and a report
 * is ignored while the reported person has an open report against the reporter for the same order.
 */
export async function createOrderReport(reporterId: string, orderId: string, side: OrderSide,
  reason: string, details: string) {
  // A listing belongs to the seller, so only a buyer can say it was wrong. Otherwise a seller could mark a buyer for the seller's own listing.
  if (side === "seller" && reason === "listing_inaccurate") throw new OrderError(400, "Only a buyer can report a listing as inaccurate.");
  if (details.trim().length < REPORT_MIN_DETAILS) throw new OrderError(400, `Please write at least ${REPORT_MIN_DETAILS} characters about what happened.`);
  const { report, confirmed, fakeKey } = await db.transaction(async (tx) => {
    await requireActiveUser(tx, reporterId, side);
    const owner = side === "buyer" ? orders.buyersId : orders.sellersId;
    const [order] = await tx.select().from(orders).where(and(eq(orders.id, orderId), eq(owner, reporterId))).limit(1);
    if (!order) throw new OrderError(404, "Order not found");
    const subjectId = side === "buyer" ? order.sellersId : order.buyersId;
    const [openAgainstMe] = await tx.select({ id: order_reports.id }).from(order_reports).where(and(
      eq(order_reports.orderId, orderId), eq(order_reports.reporterId, subjectId), eq(order_reports.subjectId, reporterId),
      inArray(order_reports.status, ["submitted", "pending_corroboration"]))).limit(1);
    const [report] = await tx.insert(order_reports).values({
      orderId, reporterId, subjectId, reason, details: details.trim(),
      status: openAgainstMe ? "rejected" : "submitted", resolution: openAgainstMe ? "ignored_reciprocal" : null,
      resolvedAt: openAgainstMe ? new Date() : null,
    }).onConflictDoNothing({ target: [order_reports.orderId, order_reports.reporterId] }).returning();
    if (!report) throw new OrderError(409, "You already reported this order");
    if (openAgainstMe) {
      await notifyBuyer(tx, { buyerId: reporterId, orderId, key: `report-result:${report.id}:ignored`, kind: "trust_decision",
        message: "Your report was set aside because the other person already has an open report against you for this order." });
      return { report, confirmed: null, fakeKey: null };
    }
    await recordTrustEvent(tx, { eventKey: `report:${report.id}`, orderId, subjectId, kind: "user_report", classification: "allegation", sourceId: report.id });
    const confirmed = await confirmReportedViolation(tx, subjectId, reason);
    const fakeKey = side === "buyer" ? await recordFakeReportsIfCounted(tx, reporterId, report.id) : null;
    return { report, confirmed: confirmed ? { ...confirmed, subjectId } : null, fakeKey };
  });
  if (confirmed) await evaluateTrustAction(confirmed.subjectId, null, confirmed.eventKey, confirmed.kind);
  if (fakeKey) await evaluateTrustAction(reporterId, null, fakeKey, "buyer_fake_reports");
  return report;
}

import { and, countDistinct, eq } from "drizzle-orm";
import { order_reports } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { trustReportConfirmCount } from "./policy";
import { recordTrustEvent } from "./index";

/** Report reasons that match a violation type from the paper. "pickup_problem" and "other" never count on their own. */
export const reportViolationKinds: Record<string, string> = {
  listing_inaccurate: "misleading_product_info",
  conduct: "inappropriate_communication",
  qr_misuse: "qr_misuse",
};

/**
 * A report alone is only an allegation. When enough different people report the same thing about the same person,
 * the paper's "supported report" rule is met and one verified violation is recorded for each full group.
 * Returns the new verified event, or null when nothing was confirmed.
 */
export async function confirmReportedViolation(tx: OrderTransaction, subjectId: string, reason: string) {
  const kind = reportViolationKinds[reason];
  if (!kind) return null;
  const [row] = await tx.select({ reporters: countDistinct(order_reports.reporterId) }).from(order_reports)
    .where(and(eq(order_reports.subjectId, subjectId), eq(order_reports.reason, reason)));
  const groups = Math.floor(Number(row?.reporters ?? 0) / trustReportConfirmCount);
  if (groups < 1) return null;
  const eventKey = `report-confirmed:${subjectId}:${reason}:${groups}`;
  const [event] = await recordTrustEvent(tx, { eventKey, subjectId, kind, classification: "verified" });
  return event ? { eventKey, kind } : null;
}

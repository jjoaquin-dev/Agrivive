import { and, eq, gte, sql } from "drizzle-orm";
import { order_reports } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { recordTrustEvent } from "./index";

export const FAKE_REPORT_GROUP = 3;
export const FAKE_REPORT_DAYS = 14;

/**
 * Table 1: 3 or more reports by one buyer with none confirmed in 14 days adds 1 point for each group of 3.
 * Run after a new report. Only the report that completes a group of 3 adds the point, so a report is never counted twice.
 * Returns the new event, or null.
 */
export async function recordFakeReportsIfCounted(tx: OrderTransaction, reporterId: string, reportId: string, now = new Date()) {
  const since = new Date(now.getTime() - FAKE_REPORT_DAYS * 86_400_000);
  const [row] = await tx.select({
    total: sql<number>`count(*)::int`,
    confirmed: sql<number>`count(*) filter (where ${order_reports.status} = 'confirmed')::int`,
  }).from(order_reports).where(and(
    eq(order_reports.reporterId, reporterId), gte(order_reports.createdAt, since),
    sql`${order_reports.resolution} is distinct from 'ignored_reciprocal'`));
  const total = Number(row?.total ?? 0);
  if (total < FAKE_REPORT_GROUP || total % FAKE_REPORT_GROUP !== 0 || Number(row?.confirmed ?? 0) > 0) return null;
  const eventKey = `fake-reports:${reporterId}:${reportId}`;
  const [event] = await recordTrustEvent(tx, {
    eventKey, subjectId: reporterId, kind: "buyer_fake_reports", classification: "verified", sourceId: reportId,
    reason: `${total} reports in ${FAKE_REPORT_DAYS} days and none confirmed`,
  });
  return event ? eventKey : null;
}

import { and, eq, gte, inArray, like, sql } from "drizzle-orm";
import { order_reports } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { notifyBuyer } from "../pickup/notify";
import { trustReportConfirmCount, trustScoreWindowStart } from "./policy";
import { recordTrustEvent } from "./index";

/** Report reasons that match a violation type from the paper. "pickup_problem" and "other" never count on their own. */
export const reportViolationKinds: Record<string, string> = {
  listing_inaccurate: "misleading_product_info",
  conduct: "inappropriate_communication",
  qr_misuse: "qr_misuse",
};

/** A pair of people who confirmed twice against the same person in the window can no longer confirm alone. */
export const PAIR_LIMIT = 2;
const pairKey = (a: string, b: string) => [a, b].sort().join(":");

type Report = typeof order_reports.$inferSelect;

async function notifyReporters(tx: OrderTransaction, reports: Report[], message: string, tag: string) {
  for (const report of reports) {
    await notifyBuyer(tx, { buyerId: report.reporterId, orderId: report.orderId, key: `report-result:${report.id}:${tag}`, message, kind: "trust_decision" });
  }
}

/**
 * A report alone is an allegation (0 points). When two different people report the same reason about the same person,
 * one verified violation is recorded for that pair. A pair that already confirmed twice in 90 days cannot confirm again
 * alone: a third independent reporter is needed. Until one reports, the allegation stays at 0 points. Returns the new verified event, or null.
 */
export async function confirmReportedViolation(tx: OrderTransaction, subjectId: string, reason: string) {
  const kind = reportViolationKinds[reason];
  if (!kind) return null;
  const waiting = await tx.select().from(order_reports).where(and(
    eq(order_reports.subjectId, subjectId), eq(order_reports.reason, reason),
    inArray(order_reports.status, ["submitted", "pending_corroboration"]),
  )).orderBy(order_reports.createdAt);
  const byReporter = new Map<string, Report>();
  for (const report of waiting) if (!byReporter.has(report.reporterId)) byReporter.set(report.reporterId, report);
  const candidates = [...byReporter.values()];
  if (candidates.length < trustReportConfirmCount) {
    await tx.update(order_reports).set({ status: "pending_corroboration" }).where(inArray(order_reports.id, waiting.map((r) => r.id)));
    return null;
  }
  const since = trustScoreWindowStart() ?? new Date(0);
  const confirmed = await tx.select({ resolution: order_reports.resolution }).from(order_reports).where(and(
    eq(order_reports.subjectId, subjectId), eq(order_reports.status, "confirmed"), like(order_reports.resolution, "pair:%"),
    gte(order_reports.resolvedAt, since)));
  const used = (a: string, b: string) => confirmed.filter((row) => row.resolution === `pair:${pairKey(a, b)}`).length / 2;
  let pair: [Report, Report] | null = null;
  for (let i = 0; i < candidates.length && !pair; i++) {
    for (let j = i + 1; j < candidates.length && !pair; j++) {
      if (used(candidates[i]!.reporterId, candidates[j]!.reporterId) < PAIR_LIMIT) pair = [candidates[i]!, candidates[j]!];
    }
  }
  if (!pair) {
    // Only a pair that already confirmed twice is left: the report waits for a third independent reporter.
    await tx.update(order_reports).set({ status: "pending_corroboration" }).where(inArray(order_reports.id, candidates.map((r) => r.id)));
    await notifyReporters(tx, candidates, "You and the same person already confirmed two reports about this user in 90 days. This report stays at 0 points until a third person reports the same thing.", "third");
    return null;
  }
  const [first, second] = pair;
  const now = new Date();
  await tx.update(order_reports).set({ status: "confirmed", resolution: `pair:${pairKey(first.reporterId, second.reporterId)}`, resolvedAt: now })
    .where(inArray(order_reports.id, [first.id, second.id]));
  const eventKey = `report-confirmed:${subjectId}:${reason}:${first.id}:${second.id}`;
  const [event] = await recordTrustEvent(tx, { eventKey, subjectId, orderId: first.orderId, kind, classification: "verified", sourceId: first.id, reason: `Confirmed by two different reporters` });
  await notifyReporters(tx, [first, second], "Two different people agreed on your report, so it was confirmed. Thank you for helping keep Agrivive fair.", "confirmed");
  return event ? { eventKey, kind } : null;
}



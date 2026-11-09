import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { order_declines, order_reports, buyer_no_shows, trust_disputes, trust_events } from "../../../db/schema";
import { OrderError } from "../../../utils/order-types";
import { notifyBuyer, notifySeller } from "../../../utils/pickup/notify";
import { checkDisputeRules } from "../../../utils/trust/dispute-rules";
import { recalculateTrustStanding } from "../../../utils/trust/recalculate";
import type { DisputeBody } from "../model/trust.case";

/** Every counted event can be disputed within 7 days, with a written reason. The system decides at once from the stored records. */
export const DISPUTE_WINDOW_DAYS = 7;

export function reportIdsOfEvent(eventKey: string) {
  const parts = eventKey.split(":");
  return eventKey.startsWith("report-confirmed:") ? parts.slice(-2) : [];
}

const message = {
  upheld: (because: string) => `Your dispute was accepted. ${because} The event was removed and your score was recalculated.`,
  rejected: (because: string) => `Your dispute was checked against the records and the event stays. ${because}`,
  unresolved: (because: string) => `Your dispute was saved, but the system could not settle it. ${because} The event stays for now.`,
};

export async function createTrustDispute(userId: string, eventId: string, body: DisputeBody) {
  const result = await db.transaction(async (tx) => {
    const [event] = await tx.select().from(trust_events).where(and(eq(trust_events.id, eventId), eq(trust_events.subjectId, userId))).for("update").limit(1);
    if (!event || event.classification !== "verified") throw new OrderError(404, "Trust event not found");
    if (event.invalidatedAt) throw new OrderError(409, "This event no longer counts");
    if ((event.weight ?? 0) <= 0) throw new OrderError(409, "This event added no points, so there is nothing to dispute");
    if (Date.now() - event.createdAt.getTime() > DISPUTE_WINDOW_DAYS * 86_400_000) {
      throw new OrderError(410, "The 7 days to dispute this event have passed");
    }
    const verdict = await checkDisputeRules(tx, event);
    const now = new Date();
    const [dispute] = await tx.insert(trust_disputes).values({ eventId, userId, reason: body.reason.trim(), status: verdict.status, decision: verdict.because, decidedAt: now })
      .onConflictDoNothing({ target: trust_disputes.eventId }).returning();
    if (!dispute) throw new OrderError(409, "You already disputed this event");
    const reportIds = reportIdsOfEvent(event.eventKey);
    for (const reportId of reportIds) {
      await tx.update(order_reports).set({ status: verdict.status === "upheld" ? "overturned" : verdict.status === "rejected" ? "confirmed" : "disputed" }).where(eq(order_reports.id, reportId));
    }
    if (verdict.status === "upheld") {
      await tx.update(trust_events).set({ invalidatedAt: now }).where(eq(trust_events.id, event.id));
      if (event.kind === "seller_decline_fault" && event.orderId) await tx.update(order_declines).set({ status: "overturned" }).where(eq(order_declines.orderId, event.orderId));
      if (event.kind === "buyer_failed_reservation" && event.orderId) await tx.update(buyer_no_shows).set({ excused: true }).where(eq(buyer_no_shows.orderId, event.orderId));
    }
    const text = message[verdict.status](verdict.because);
    const key = `dispute-decided:${dispute.id}`;
    await notifyBuyer(tx, { buyerId: userId, key, message: text, kind: "trust_decision" });
    await notifySeller(tx, { sellerId: userId, key, message: text, kind: "trust_decision" });
    return { dispute, verdict };
  });
  if (result.verdict.status === "upheld") await recalculateTrustStanding(userId, "A dispute was upheld");
  return { ...result.dispute, result: result.verdict.status, because: result.verdict.because };
}

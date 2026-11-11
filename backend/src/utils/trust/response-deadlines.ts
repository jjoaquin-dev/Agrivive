import type { OrderTransaction } from "../order-types";
import { countedWaitMs } from "../pickup/open-hours";
import { queueTrustNotice, recordTrustEvent } from "./index";

export interface PendingReply {
  /** Keeps notices and events unique. An inquiry uses its own id; a chat uses its id plus when the wait began. */
  key: string;
  orderId: string | null;
  buyerId: string;
  sellerId: string;
  since: Date;
  sourceId: string;
}

export type ReplyDeadlineStage = 1 | 2 | 3;

/** The paper's seller responsiveness schedule (Table 17): 12 open hours reminder, 24 open hours warning and buyer notice, 48 open hours non-responsive. Only hours the stall is open count. */
export async function recordReplyDeadlines(tx: OrderTransaction, pending: PendingReply, now: Date) {
  // The clock runs only while the stall is open. It stops when the stall is closed or the seller's Away mode is on.
  const hours = (await countedWaitMs(tx, pending.sellerId, pending.since, now)) / 3_600_000;
  if (hours >= 12) await queueTrustNotice(tx, {
    noticeKey: `inquiry-reminder:${pending.key}`, recipientId: pending.sellerId,
    orderId: pending.orderId, kind: "inquiry_12h_reminder",
  });
  if (hours >= 24) {
    await queueTrustNotice(tx, {
      noticeKey: `inquiry-warning:${pending.key}`, recipientId: pending.sellerId,
      orderId: pending.orderId, kind: "inquiry_24h_warning",
    });
    await queueTrustNotice(tx, {
      noticeKey: `inquiry-buyer:${pending.key}`, recipientId: pending.buyerId,
      orderId: pending.orderId, kind: "inquiry_24h_buyer_notice",
    });
  }
  const flagged = hours >= 48;
  if (flagged) await recordTrustEvent(tx, {
    eventKey: `inquiry-unanswered:${pending.key}`, orderId: pending.orderId,
    subjectId: pending.sellerId, kind: "inquiry_non_response",
    classification: "verified", sourceId: pending.sourceId,
  });
  const stage: ReplyDeadlineStage = flagged ? 3 : hours >= 24 ? 2 : 1;
  return { stage, flagged, eventKey: `inquiry-unanswered:${pending.key}` };
}

/** Which timer stage is next for a question that has waited this long. */
export function dueHours(stage: number): number | null {
  return stage === 0 ? 12 : stage === 1 ? 24 : stage === 2 ? 48 : null;
}

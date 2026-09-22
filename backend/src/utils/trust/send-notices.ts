import { and, asc, eq, isNull, lt, lte, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { trust_notices, user } from "../../db/schema";
import { sendEmail } from "../email";

const messages: Record<string, { subject: string; text: string }> = {
  seller_cancellation_warning: { subject: "Agrivive order cancellation warning", text: "You cancelled a pending buyer order. This event was recorded in your trust history." },
  seller_cancellation_buyer: { subject: "Agrivive order cancelled", text: "The seller cancelled your order. Reserved stock was restored." },
  inquiry_12h_reminder: { subject: "Agrivive inquiry reminder", text: "A buyer inquiry has been waiting for your reply for 12 hours." },
  inquiry_24h_warning: { subject: "Agrivive inquiry warning", text: "A buyer inquiry has been waiting for your reply for 24 hours." },
  inquiry_24h_buyer_notice: { subject: "Agrivive inquiry update", text: "The seller has not replied to your inquiry after 24 hours." },
  trust_event_corrected: { subject: "Agrivive trust record corrected", text: "A trust event was invalidated after its source data was rechecked." },
};

export async function sendPendingTrustNotices(limit = 25) {
  let sent = 0;
  for (let i = 0; i < limit; i++) {
    const available = and(
      isNull(trust_notices.sentAt), lt(trust_notices.attempts, 5),
      or(isNull(trust_notices.lockedUntil), lte(trust_notices.lockedUntil, new Date())),
    );
    const [candidate] = await db.select({ id: trust_notices.id }).from(trust_notices)
      .where(available).orderBy(asc(trust_notices.createdAt)).limit(1);
    if (!candidate) break;
    const [notice] = await db.update(trust_notices).set({
      attempts: sql`${trust_notices.attempts} + 1`,
      lockedUntil: new Date(Date.now() + 5 * 60_000),
    }).where(and(
      eq(trust_notices.id, candidate.id), available,
    )).returning();
    if (!notice) continue;
    const [recipient] = await db.select({ email: user.email }).from(user)
      .where(eq(user.id, notice.recipientId)).limit(1);
    const message = messages[notice.kind];
    if (!recipient || !message) continue;
    try {
      await sendEmail(recipient.email, message.subject, `${message.text}\nOrder: ${notice.orderId}`,
        `trust:${notice.noticeKey}`);
      await db.update(trust_notices).set({ sentAt: new Date(), lockedUntil: null })
        .where(eq(trust_notices.id, notice.id));
      sent++;
    } catch (error) {
      console.error("Trust notice delivery failed", { noticeId: notice.id, error });
      await db.update(trust_notices).set({ lockedUntil: new Date(Date.now() + 5 * 60_000) })
        .where(eq(trust_notices.id, notice.id));
    }
  }
  return sent;
}

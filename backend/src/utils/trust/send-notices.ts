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
  trust_action_warning: { subject: "Agrivive trust warning", text: "Your verified trust history reached the warning threshold. Review your account activity and keep future transactions responsive." },
  trust_action_restriction: { subject: "Agrivive temporary restriction", text: "Your account has a temporary restriction because verified trust events reached the configured restriction threshold. The restriction will expire automatically unless a newer action applies." },
  trust_action_blocked: { subject: "Agrivive account recovery", text: "Your account is blocked by the trust policy. Use the Agrivive recovery screen and verify the email OTP to restore access." },
  trust_action_expired: { subject: "Agrivive restriction ended", text: "Your temporary trust restriction has ended automatically. You can use Agrivive again." },
  buyer_failed_reservation_warning: { subject: "Agrivive uncollected reservation notice", text: "A vegetable reservation expired before pickup. This incident has been recorded in your buyer trust history." },
  inactivity_3w_warning: { subject: "Agrivive inactivity reminder", text: "You have not been active in Agrivive for three weeks. Please log in or update your activity to maintain your account standing." },
  inactivity_1m_blocked: { subject: "Agrivive account blocked due to inactivity", text: "Your account has been deactivated after 30 days of inactivity. Please follow the recovery process to restore access." },
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
      const details = `${message.text}${notice.orderId ? `\nOrder: ${notice.orderId}` : ""}`;
      await sendEmail(recipient.email, message.subject, details, `trust:${notice.noticeKey}`);
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

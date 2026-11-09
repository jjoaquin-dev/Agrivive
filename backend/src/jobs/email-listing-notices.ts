import { and, asc, eq, gte, isNull, lt, sql } from "drizzle-orm";
import { db } from "../db";
import { buyer_listing_notices, seller_listing_events, user } from "../db/schema";
import { sendEmail } from "../utils/email";

const MAX_ATTEMPTS = 5;
/** Updates older than this are not emailed, so a long outage never sends a flood of old news. */
const MAX_AGE_HOURS = 24;

function content(event: typeof seller_listing_events.$inferSelect) {
  const { shopName, productName, metadata } = event;
  if (event.eventType === "price_drop") {
    const price = metadata.newPrice ? ` to ₱${metadata.newPrice}` : "";
    return { subject: `Price drop at ${shopName}: ${productName}`, line: `${shopName} lowered the price of ${productName}${price}.` };
  }
  if (event.eventType === "restock") return { subject: `Back in stock at ${shopName}: ${productName}`, line: `${shopName} restocked fresh ${productName}.` };
  return { subject: `New from ${shopName}: ${productName}`, line: `${productName} is now available at ${shopName}.` };
}

/**
 * Emails each follower about an update from a seller they follow. Only followers of that seller have a notice row,
 * so nobody gets an email about a seller they do not follow. Each notice is emailed once.
 */
export async function emailListingNotices(limit = 25) {
  const base = (process.env.WEB_APP_URL ?? process.env.WEB_TRUSTED_ORIGINS?.split(",")[0] ?? "").trim().replace(/\/$/, "");
  const since = new Date(Date.now() - MAX_AGE_HOURS * 3_600_000);
  const pending = await db.select({ notice: buyer_listing_notices, event: seller_listing_events, email: user.email })
    .from(buyer_listing_notices)
    .innerJoin(seller_listing_events, eq(seller_listing_events.id, buyer_listing_notices.eventId))
    .innerJoin(user, eq(user.id, buyer_listing_notices.buyerId))
    .where(and(
      isNull(buyer_listing_notices.emailSentAt), lt(buyer_listing_notices.emailAttempts, MAX_ATTEMPTS),
      gte(buyer_listing_notices.createdAt, since), eq(user.isActive, true)))
    .orderBy(asc(buyer_listing_notices.createdAt)).limit(limit);
  let sent = 0;
  for (const { notice, event, email } of pending) {
    const { subject, line } = content(event);
    const link = base ? `\nSee it: ${base}/marketplace/${event.productId}` : "";
    try {
      await db.update(buyer_listing_notices).set({ emailAttempts: sql`${buyer_listing_notices.emailAttempts} + 1` }).where(eq(buyer_listing_notices.id, notice.id));
      await sendEmail(email, subject, `${line}${link}\n\nYou get this because you follow ${event.shopName} on Agrivive. Unfollow the shop in the app to stop these emails.`, `listing-notice:${notice.id}`);
      await db.update(buyer_listing_notices).set({ emailSentAt: new Date() }).where(eq(buyer_listing_notices.id, notice.id));
      sent++;
    } catch (error) {
      console.error("Follower email failed", { noticeId: notice.id, error });
    }
  }
  return sent;
}

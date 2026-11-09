import { and, eq, gte, sql } from "drizzle-orm";
import { order_declines, order_inquiries, order_reports, order_reviews, orders, product_inquiries, sellers_product, trust_events } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { isLateCancellation } from "../pickup/qr-window";

export type DisputeVerdict = { status: "upheld" | "rejected" | "unresolved"; because: string };

const upheld = (because: string): DisputeVerdict => ({ status: "upheld", because });
const rejected = (because: string): DisputeVerdict => ({ status: "rejected", because });
const unresolved = (because: string): DisputeVerdict => ({ status: "unresolved", because });
const REPLY_HOURS = 48;

/**
 * The system decides a dispute by checking the record the event came from against the rule that created it.
 * Upheld: the record no longer fits the rule. Rejected: the record still fits it. Unresolved: no stored record
 * can settle it, so the event keeps counting until a rule for that case is written.
 */
export async function checkDisputeRules(tx: OrderTransaction, event: typeof trust_events.$inferSelect): Promise<DisputeVerdict> {
  const [order] = event.orderId ? await tx.select().from(orders).where(eq(orders.id, event.orderId)).limit(1) : [];
  switch (event.kind) {
    case "seller_cancellation":
      return order?.status === "cancelled" && order.cancelledBy === event.subjectId && order.confirmedAt
        ? rejected("The order shows you cancelled a confirmed order.") : upheld("The order does not show a confirmed order cancelled by you.");
    case "buyer_late_cancellation":
      return order?.cancelledAt && isLateCancellation(order.pickupStart, order.cancelledAt)
        ? rejected("The order was cancelled within 3 hours of the pickup time.") : upheld("The order was not cancelled within 3 hours of the pickup time.");
    case "buyer_failed_reservation":
      return order?.status === "expired" || order?.noShowAt ? rejected("The order shows the pickup was missed.") : upheld("The order does not show a missed pickup.");
    case "low_rating": {
      const [review] = event.sourceId ? await tx.select().from(order_reviews).where(eq(order_reviews.id, event.sourceId)).limit(1) : [];
      return review && review.rating <= 2 ? rejected("The rating is 1 or 2 stars.") : upheld("The rating is not 1 or 2 stars.");
    }
    case "inquiry_non_response": {
      if (!event.sourceId) return unresolved("The question this point came from was not stored.");
      const [orderQuestion] = await tx.select().from(order_inquiries).where(eq(order_inquiries.id, event.sourceId)).limit(1);
      const [question] = orderQuestion ? [orderQuestion] : await tx.select().from(product_inquiries).where(eq(product_inquiries.id, event.sourceId)).limit(1);
      if (!question) return unresolved("The question this point came from was not stored.");
      const within = question.repliedAt && question.repliedAt.getTime() - question.createdAt.getTime() <= REPLY_HOURS * 3_600_000;
      return within ? upheld("The record shows a reply within 48 hours.") : rejected("The record shows no reply within 48 hours.");
    }
    case "seller_decline_fault":
    case "buyer_invalid_decline":
    case "buyer_false_photo": {
      const [decline] = event.orderId ? await tx.select().from(order_declines).where(eq(order_declines.orderId, event.orderId)).limit(1) : [];
      if (!decline) return unresolved("The decline record was not found.");
      if (event.kind === "buyer_invalid_decline") return decline.reasonValid ? upheld("The reason chosen is an allowed reason.") : rejected("The reason chosen is not an allowed reason.");
      if (event.kind === "buyer_false_photo") return decline.photoReused ? rejected("The same photo was used on another decline.") : upheld("The photo was not used on another decline.");
      return decline.reasonValid && !decline.photoReused ? rejected("The reason is allowed and the photo is new.") : upheld("The decline reason or photo does not meet the rules.");
    }
    case "self_order": {
      const [product] = event.sourceId ? await tx.select({ userId: sellers_product.userId }).from(sellers_product).where(eq(sellers_product.id, event.sourceId)).limit(1) : [];
      if (!product) return unresolved("The listing this point came from was not found.");
      return product.userId === event.subjectId ? rejected("The listing belongs to your own stall.") : upheld("The listing does not belong to your stall.");
    }
    case "buyer_fake_reports": {
      if (!event.sourceId) return unresolved("The reports this point came from were not stored.");
      const since = new Date(event.createdAt.getTime() - 14 * 86_400_000);
      const [row] = await tx.select({ n: sql<number>`count(*)::int` }).from(order_reports).where(and(
        eq(order_reports.reporterId, event.subjectId), eq(order_reports.status, "confirmed"), gte(order_reports.createdAt, since)));
      return Number(row?.n ?? 0) > 0 ? upheld("One of your reports in that time was confirmed.") : rejected("None of your reports in that time was confirmed.");
    }
    default:
      return unresolved("This point came from reports. The system has no stored record that can settle it yet.");
  }
}

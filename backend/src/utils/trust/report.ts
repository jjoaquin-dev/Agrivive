import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { order_reports, orders } from "../../db/schema";
import { requireActiveUser } from "../order-access";
import { OrderError, type OrderSide } from "../order-types";
import { recordTrustEvent } from "./index";

export function createOrderReport(reporterId: string, orderId: string, side: OrderSide,
  reason: string, details: string) {
  if (details.trim().length < 5) throw new OrderError(400, "Report details are required");
  return db.transaction(async (tx) => {
    await requireActiveUser(tx, reporterId, side);
    const owner = side === "buyer" ? orders.buyersId : orders.sellersId;
    const [order] = await tx.select().from(orders).where(and(
      eq(orders.id, orderId), eq(owner, reporterId),
    )).limit(1);
    if (!order) throw new OrderError(404, "Order not found");
    const subjectId = side === "buyer" ? order.sellersId : order.buyersId;
    const [report] = await tx.insert(order_reports).values({
      orderId, reporterId, subjectId, reason, details: details.trim(),
    }).onConflictDoNothing({ target: [order_reports.orderId, order_reports.reporterId] }).returning();
    if (!report) throw new OrderError(409, "You already reported this order");
    await recordTrustEvent(tx, { eventKey: `report:${report.id}`, orderId, subjectId,
      kind: "user_report", classification: "allegation", sourceId: report.id });
    return report;
  });
}

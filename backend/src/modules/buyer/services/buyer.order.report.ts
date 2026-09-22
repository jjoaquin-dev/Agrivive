import { createOrderReport } from "../../../utils/trust/report";
import type { BuyerReportBody } from "../model/buyer.order.report";

export function createBuyerOrderReport(buyerId: string, orderId: string, body: BuyerReportBody) {
  return createOrderReport(buyerId, orderId, "buyer", body.reason, body.details);
}

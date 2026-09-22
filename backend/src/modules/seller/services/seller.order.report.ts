import { createOrderReport } from "../../../utils/trust/report";
import type { SellerReportBody } from "../model/seller.order.report";

export function createSellerOrderReport(sellerId: string, orderId: string, body: SellerReportBody) {
  return createOrderReport(sellerId, orderId, "seller", body.reason, body.details);
}

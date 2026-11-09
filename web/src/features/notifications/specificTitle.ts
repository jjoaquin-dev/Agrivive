import type { BuyerNotice } from "./types";

/** A specific headline that names the seller, order or product, or null when the notice has no such detail. */
export function specificTitle(notice: BuyerNotice): string | null {
  const shop = notice.shopName || "The seller";
  const code = notice.orderId ? ` RSV-${notice.orderId.slice(0, 4).toUpperCase()}` : "";
  const product = notice.productName || "Produce";

  switch (notice.kind) {
    case "seller_review_reply": return `${shop} replied to your feedback in your order${code}`;
    case "seller_inquiry_reply": return notice.orderId ? `${shop} answered your question about order${code}` : null;
    case "seller_cancellation_buyer": return `${shop} cancelled your order${code}`;
    case "seller_price_drop": return `${product} lowered its price`;
    case "seller_restock": return `${product} is back in stock`;
    case "seller_new_listing": return `${shop} posted ${product}`;
  }
  if (notice.kind !== "order_update") return null;
  switch (notice.event) {
    case "order-placed": return `Your order${code} is placed at ${shop}`;
    case "order-confirmed": return `${shop} confirmed your order${code}`;
    case "order-ready": return `Your order${code} is ready for pickup`;
    case "order-completed": return `Pickup complete for your order${code}`;
    case "qr-expired": return `Your pickup QR for order${code} expired`;
    default: return null;
  }
}

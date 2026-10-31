import { getSellerNoticeDef, sellerOrderCode, type SellerNoticeCategory, type SellerNoticePayload } from "./messages";

export type SellerNotificationItem = {
  id: string;
  source: "alert" | "trust";
  kind: string;
  category: SellerNoticeCategory;
  title: string;
  body: string;
  orderId: string | null;
  productId: string | null;
  createdAt: Date;
  readAt: Date | null;
};

type Row = {
  id: string;
  kind: string;
  orderId: string | null;
  productId?: string | null;
  payload?: SellerNoticePayload | null;
  createdAt: Date;
  readAt: Date | null;
};

/** Gives one stored row its title, body and tab, so the app does not guess from `kind`. */
export function toSellerNotificationItem(source: "alert" | "trust", row: Row): SellerNotificationItem {
  const def = getSellerNoticeDef(row.kind);
  const payload = {
    ...(row.orderId ? { code: sellerOrderCode(row.orderId) } : {}),
    ...(row.payload ?? {}),
  };
  const isInquiry = row.kind.includes("inquiry");
  return {
    id: row.id,
    source,
    kind: row.kind,
    category: def?.category ?? (isInquiry ? "messages" : "trust"),
    title: def?.title ?? (isInquiry ? "Buyer Question Waiting" : "Account Update"),
    body: def?.body(payload) ?? "Open this to see what changed on your account.",
    orderId: row.orderId,
    productId: row.productId ?? null,
    createdAt: row.createdAt,
    readAt: row.readAt,
  };
}

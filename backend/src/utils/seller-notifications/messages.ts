export type SellerNoticeLevel = "sound" | "silent" | "feed";
export type SellerNoticeTopic = "orders" | "stock_price" | "boost" | "account";
export type SellerNoticeCategory = "reservations" | "messages" | "listings" | "trust";
export type SellerNoticeTarget = "order" | "listing" | "notifications" | "trust" | "messages";

export type SellerNoticePayload = Record<string, unknown>;

export type SellerNoticeDef = {
  title: string;
  plural: string;
  body: (payload: SellerNoticePayload) => string;
  level: SellerNoticeLevel;
  topic: SellerNoticeTopic;
  category: SellerNoticeCategory;
  target: SellerNoticeTarget;
  /** Keeps its sound during Night Mode. */
  nightExempt?: boolean;
};

const text = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

const code = (p: SellerNoticePayload) => text(p.code, "Your reservation");
const product = (p: SellerNoticePayload) => text(p.productName, "Your listing");

export const sellerNoticeDefs = {
  new_reservation: {
    title: "New Reservation", plural: "New Reservations",
    body: (p) => text(p.summary, "A buyer reserved produce from your stall"),
    level: "sound", topic: "orders", category: "reservations", target: "order", nightExempt: true,
  },
  reservation_ending: {
    title: "Reservation Ends Soon", plural: "Reservations End Soon",
    body: (p) => `${code(p)} has about an hour left. The buyer has not picked up yet.`,
    level: "sound", topic: "orders", category: "reservations", target: "order", nightExempt: true,
  },
  reservation_ended: {
    title: "Reservation Ended", plural: "Reservations Ended",
    body: (p) => `${code(p)} was not picked up in time. The stock went back to your listing.`,
    level: "silent", topic: "orders", category: "reservations", target: "order",
  },
  buyer_cancelled: {
    title: "Buyer Cancelled", plural: "Buyers Cancelled",
    body: (p) => `${code(p)} was cancelled by the buyer. The stock went back to your listing.`,
    level: "sound", topic: "orders", category: "reservations", target: "order",
  },
  pickup_done: {
    title: "Pickup Done", plural: "Pickups Done",
    body: (p) => `${code(p)} was picked up. Pickup confirmed.`,
    level: "feed", topic: "orders", category: "reservations", target: "order",
  },
  listing_live: {
    title: "Listing Is Live", plural: "Listings Are Live",
    body: (p) => `${product(p)} is now on sale.`,
    level: "feed", topic: "stock_price", category: "listings", target: "listing",
  },
  running_low: {
    title: "Running Low", plural: "Running Low",
    body: (p) => `${product(p)} is running low. ${text(p.left, "A little")} left.`,
    level: "silent", topic: "stock_price", category: "listings", target: "listing",
  },
  sold_out: {
    title: "Sold Out", plural: "Sold Out",
    body: (p) => `${product(p)} is sold out.`,
    level: "silent", topic: "stock_price", category: "listings", target: "listing",
  },
  price_lowered: {
    title: "Price Lowered", plural: "Prices Lowered",
    body: (p) => p.priceBefore
      ? `${product(p)} went from ₱${text(p.priceBefore, "?")} to ₱${text(p.priceAfter, "?")}. ${
        p.waitHours ? `You can boost it again in ${p.waitHours} hours.` : "Tap to boost it again."}`
      : `${product(p)} is now ₱${text(p.priceAfter, "lower")}. You can boost it from your list.`,
    level: "silent", topic: "stock_price", category: "listings", target: "notifications",
  },
  boost_started: {
    title: "Boost Started", plural: "Boosts Started",
    body: (p) => p.willLowerPrice
      ? `${product(p)} was posted. In 6 hours we lower the price if it has not sold out.`
      : `${product(p)} was posted on the Agrivive Facebook Page.`,
    level: "silent", topic: "boost", category: "listings", target: "notifications",
  },
  boost_posted: {
    title: "Boost Posted", plural: "Boosts Posted",
    body: (p) => `${product(p)} was posted to the Agrivive pages.`,
    level: "silent", topic: "boost", category: "listings", target: "notifications",
  },
  boost_failed: {
    title: "Boost Did Not Post", plural: "Boosts Did Not Post",
    body: (p) => `We could not post ${product(p)}. Please try again later.`,
    level: "silent", topic: "boost", category: "listings", target: "notifications",
  },
  // Trust notices (stored in trust_notices, shown here with plain wording).
  seller_cancellation_warning: {
    title: "Cancellation Warning", plural: "Cancellation Warnings",
    body: (p) => `You cancelled ${code(p)}. This is saved in your record.`,
    level: "silent", topic: "account", category: "trust", target: "trust",
  },
  trust_event_corrected: {
    title: "Record Fixed", plural: "Records Fixed",
    body: () => "We checked your record again and removed a mistake.",
    level: "feed", topic: "account", category: "trust", target: "trust",
  },
  trust_action_warning: {
    title: "Account Warning", plural: "Account Warnings",
    body: () => "Your record reached the warning level. Please reply to buyers on time.",
    level: "silent", topic: "account", category: "trust", target: "trust",
  },
  trust_action_restriction: {
    title: "Account Limited", plural: "Account Limited",
    body: () => "Your account has a short limit. It ends by itself.",
    level: "sound", topic: "account", category: "trust", target: "trust", nightExempt: true,
  },
  trust_action_blocked: {
    title: "Account Blocked", plural: "Account Blocked",
    body: () => "Your account is blocked. Open Agrivive to get it back.",
    level: "sound", topic: "account", category: "trust", target: "trust", nightExempt: true,
  },
  trust_action_expired: {
    title: "Limit Lifted", plural: "Limits Lifted",
    body: () => "Your short limit has ended. You can use Agrivive again.",
    level: "silent", topic: "account", category: "trust", target: "trust",
  },
  inactivity_3w_warning: {
    title: "We Miss You", plural: "We Miss You",
    body: () => "You have not opened Agrivive for 3 weeks. Please log in soon.",
    level: "feed", topic: "account", category: "trust", target: "trust",
  },
  inactivity_1m_blocked: {
    title: "Account Paused", plural: "Account Paused",
    body: () => "Your account was paused after 30 days away. Follow the steps to get it back.",
    level: "feed", topic: "account", category: "trust", target: "trust",
  },
  inquiry_12h_reminder: {
    title: "Buyer Is Waiting", plural: "Buyers Are Waiting",
    body: () => "A buyer has waited 12 hours for your reply.",
    level: "sound", topic: "orders", category: "messages", target: "order",
  },
  inquiry_24h_warning: {
    title: "Buyer Still Waiting", plural: "Buyers Still Waiting",
    body: () => "A buyer has waited 24 hours for your reply.",
    level: "sound", topic: "orders", category: "messages", target: "order",
  },
} as const satisfies Record<string, SellerNoticeDef>;

export type SellerNoticeKind = keyof typeof sellerNoticeDefs;

export function getSellerNoticeDef(kind: string): SellerNoticeDef | undefined {
  return (sellerNoticeDefs as Record<string, SellerNoticeDef>)[kind];
}

export function sellerNoticePath(target: SellerNoticeTarget, orderId?: string | null) {
  if (target === "order" && orderId) return `/(app)/orders/${orderId}`;
  if (target === "listing") return "/(app)/(tabs)/inventory";
  if (target === "trust") return "/(app)/trust";
  if (target === "messages") return "/(app)/(tabs)/messages";
  return "/(app)/notifications";
}

export function sellerOrderCode(orderId: string) {
  return `RSV-${orderId.slice(0, 4).toUpperCase()}`;
}

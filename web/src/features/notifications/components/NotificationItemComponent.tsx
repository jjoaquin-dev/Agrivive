"use client";

import Link from "next/link";
import { AlertTriangle, Bell, Clock, MessageSquare, Package, Sprout, Store, Tag } from "lucide-react";
import type { BuyerNotice } from "../types";

interface NotificationItemComponentProps {
  notice: BuyerNotice;
  onSelect: (notice: BuyerNotice) => void;
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export const NotificationItemComponent = ({ notice, onSelect }: NotificationItemComponentProps) => {
  const isListing = notice.kind === "seller_new_listing";
  const isPriceDrop = notice.kind === "seller_price_drop";
  const isRestock = notice.kind === "seller_restock";
  const isProduce = isListing || isPriceDrop || isRestock;
  const isCancellation = notice.kind === "seller_cancellation_buyer";
  const isWarning = notice.kind === "trust_action_warning" || notice.kind.includes("warning");
  const isRestriction = notice.kind === "trust_action_restriction" || notice.kind.includes("restriction");
  const isTrustNotice = isWarning || isRestriction;
  const isUnread = !notice.readAt;

  const title = isRestriction
    ? "Reservations paused"
    : isWarning
    ? "Cancellation advisory"
    : isPriceDrop
    ? `@${notice.shopName || "Seller"} lowered a price`
    : isRestock
    ? `@${notice.shopName || "Seller"} restocked produce`
    : isListing
    ? `@${notice.shopName || "Seller"} posted new produce`
    : isCancellation
    ? "Reservation cancelled"
    : notice.kind === "inquiry_24h_buyer_notice"
    ? "Inquiry awaiting seller response"
    : "Agrivive account update";

  const description = isTrustNotice
    ? (notice.reason || "Please review your recent reservation cancellations to maintain account standing.")
    : isPriceDrop
    ? `${notice.productName || "Produce"} is now ₱${notice.price || ""}${notice.previousPrice ? ` (was ₱${notice.previousPrice})` : ""}.`
    : isRestock
    ? `${notice.productName || "Produce"} is back in stock and ready for reservation.`
    : isListing
    ? notice.productAvailable
      ? `${notice.productName || "Fresh produce"} is now available for pickup.`
      : `${notice.productName || "Product"} is no longer available.`
    : isCancellation
    ? "The seller cancelled this reservation and items returned to stock."
    : "Tap to review updates regarding your account or reservation.";

  const targetHref = isProduce
    ? notice.productAvailable && notice.productId
      ? `/marketplace/${notice.productId}`
      : notice.sellerId
      ? `/sellers/${notice.sellerId}`
      : "/marketplace"
    : isTrustNotice
    ? "/orders"
    : notice.orderId
    ? `/orders/${notice.orderId}`
    : "/profile";

  return (
    <div
      onClick={() => onSelect(notice)}
      className="group relative flex items-start gap-3 rounded-2xl p-3.5 transition-colors hover:bg-neutral-50/80 cursor-pointer"
    >
      <div className="relative shrink-0">
        <div
          className={`flex size-10 items-center justify-center rounded-full font-heading text-sm font-bold border border-neutral-200/80 shadow-sm ${
            isRestriction
              ? "bg-rose-50 text-rose-600"
              : isWarning
              ? "bg-amber-50 text-amber-600"
              : "bg-neutral-100 text-[#457D00]"
          }`}
        >
          {isTrustNotice ? (
            <AlertTriangle className="size-5" />
          ) : isPriceDrop ? (
            <Tag className="size-5 text-[#D97706]" />
          ) : isProduce ? (
            <Store className="size-5 text-[#457D00]" />
          ) : isCancellation ? (
            <Package className="size-5 text-neutral-600" />
          ) : (
            <Bell className="size-5 text-[#457D00]" />
          )}
        </div>
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-white shadow-sm ${
            isRestriction ? "bg-rose-600" : isWarning ? "bg-amber-500" : "bg-[#457D00]"
          }`}
        >
          {isTrustNotice ? (
            <AlertTriangle className="size-2.5" />
          ) : isProduce ? (
            <Sprout className="size-2.5" />
          ) : isCancellation ? (
            <Clock className="size-2.5" />
          ) : (
            <MessageSquare className="size-2.5" />
          )}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-semibold text-neutral-900 group-hover:text-[#457D00] transition-colors">
            {title}
          </p>
          {isUnread && (
            <span className="size-2 shrink-0 rounded-full bg-[#457D00]" aria-label="Unread notification" />
          )}
        </div>

        <div className="mt-0.5 flex items-center justify-between text-xs text-neutral-400">
          <span>{formatDateTime(notice.createdAt)}</span>
          <span className="font-medium text-neutral-500">{formatRelativeTime(notice.createdAt)}</span>
        </div>

        <div className="mt-2 rounded-xl border border-neutral-100 bg-neutral-50/70 p-2.5 text-xs leading-relaxed text-neutral-600">
          {description}
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <Link
            href={targetHref}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(notice);
            }}
            className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 ${
              isRestriction ? "bg-rose-600 hover:bg-rose-700" : isWarning ? "bg-amber-600 hover:bg-amber-700" : "bg-[#457D00] hover:bg-[#457D00]/90"
            }`}
          >
            {isTrustNotice ? "View orders" : isProduce ? "View produce" : isCancellation ? "View order" : "Details"}
          </Link>
        </div>
      </div>
    </div>
  );
};

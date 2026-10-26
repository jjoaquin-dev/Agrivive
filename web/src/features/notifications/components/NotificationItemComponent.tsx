"use client";

import Link from "next/link";
import { Bell, Clock, MessageSquare, Package, Sprout, Store } from "lucide-react";
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
  const isCancellation = notice.kind === "seller_cancellation_buyer";
  const isUnread = !notice.readAt;

  const title = isListing
    ? `@${notice.shopName || "Seller"} posted new produce`
    : isCancellation
    ? "Reservation cancelled"
    : notice.kind === "inquiry_24h_buyer_notice"
    ? "Inquiry awaiting seller response"
    : "Agrivive account update";

  const description = isListing
    ? notice.productAvailable
      ? `${notice.productName || "Fresh produce"} is now available for pickup.`
      : `${notice.productName || "Product"} is no longer available.`
    : isCancellation
    ? "The seller cancelled this reservation and items returned to stock."
    : "Tap to review updates regarding your account or reservation.";

  const targetHref = isListing
    ? notice.productAvailable && notice.productId
      ? `/marketplace/${notice.productId}`
      : notice.sellerId
      ? `/sellers/${notice.sellerId}`
      : "/marketplace"
    : notice.orderId
    ? `/orders/${notice.orderId}`
    : "/profile";

  return (
    <div
      onClick={() => onSelect(notice)}
      className="group relative flex items-start gap-3 rounded-2xl p-3.5 transition-colors hover:bg-neutral-50/80 cursor-pointer"
    >
      {/* Avatar with status icon badge */}
      <div className="relative shrink-0">
        <div className="flex size-10 items-center justify-center rounded-full bg-neutral-100 font-heading text-sm font-bold text-[#457D00] border border-neutral-200/80 shadow-2xs">
          {isListing ? (
            <Store className="size-5 text-[#457D00]" />
          ) : isCancellation ? (
            <Package className="size-5 text-neutral-600" />
          ) : (
            <Bell className="size-5 text-[#457D00]" />
          )}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#457D00] text-white shadow-2xs">
          {isListing ? (
            <Sprout className="size-2.5" />
          ) : isCancellation ? (
            <Clock className="size-2.5" />
          ) : (
            <MessageSquare className="size-2.5" />
          )}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-semibold text-neutral-900 group-hover:text-[#457D00] transition-colors">
            {title}
          </p>
          {isUnread && (
            <span className="size-2 shrink-0 rounded-full bg-[#457D00]" aria-label="Unread notification" />
          )}
        </div>

        {/* Timestamps */}
        <div className="mt-0.5 flex items-center justify-between text-[11px] text-neutral-400">
          <span>{formatDateTime(notice.createdAt)}</span>
          <span className="font-medium text-neutral-500">{formatRelativeTime(notice.createdAt)}</span>
        </div>

        {/* Preview Message Box */}
        <div className="mt-2 rounded-xl border border-neutral-100 bg-neutral-50/70 p-2.5 text-xs leading-relaxed text-neutral-600">
          {description}
        </div>

        {/* Action Buttons */}
        <div className="mt-2.5 flex items-center gap-2">
          <Link
            href={targetHref}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(notice);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-[#457D00] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-transform hover:bg-[#386600] active:scale-95"
          >
            {isListing ? "View produce" : isCancellation ? "View order" : "Details"}
          </Link>
        </div>
      </div>
    </div>
  );
};

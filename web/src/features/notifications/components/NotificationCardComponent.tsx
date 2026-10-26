"use client";

import Link from "next/link";
import { Check, Clock, Hourglass, ShoppingBasket } from "lucide-react";
import type { BuyerNotice } from "../types";

interface NotificationCardComponentProps {
  notice: BuyerNotice;
  onRead: (notice: BuyerNotice) => void;
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export const NotificationCardComponent = ({ notice, onRead }: NotificationCardComponentProps) => {
  const isListing = notice.kind === "seller_new_listing";
  const isCancellation = notice.kind === "seller_cancellation_buyer";
  const isUnread = !notice.readAt;

  const title = isListing
    ? `New Produce Drop: ${notice.productName || "Fresh Monggo"}`
    : isCancellation
    ? "Reservation Expiring Soon"
    : notice.kind === "inquiry_24h_buyer_notice"
    ? "Inquiry Awaiting Seller Response"
    : "Pickup Completed";

  const description = isListing
    ? `${notice.shopName || "Jaras Stall"} just listed a new batch of surplus ${notice.productName || "monggo beans"} at Bankerohan Public Market. Claim yours before it's gone!`
    : isCancellation
    ? `Your reservation for '${notice.productName || "Surplus Monggo"}' at ${notice.shopName || "Jaras Stall"} expires in 2 hours. Present your QR pass now.`
    : "Thank you for rescuing surplus produce! Your pickup at Jaras Stall was successfully verified.";

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
    <article
      onClick={() => onRead(notice)}
      className={`group relative flex items-start gap-4 rounded-2xl p-5 transition-all duration-200 cursor-pointer ${
        isListing && isUnread
          ? "border border-[#E2EFE5] border-l-[4px] border-l-[#1B4D36] bg-[#F4FBF6] hover:bg-[#EDF8F0]"
          : isCancellation && isUnread
          ? "border border-[#FCEFE3] border-l-[4px] border-l-[#1B4D36] bg-[#FEFAF6] hover:bg-[#FDF5ED]"
          : isUnread
          ? "border border-neutral-200 border-l-[4px] border-l-[#1B4D36] bg-[#F9FAFB] hover:bg-neutral-50"
          : "border border-neutral-200/70 bg-white hover:border-neutral-300 shadow-2xs"
      }`}
    >
      {/* Circular Status Icon */}
      <div className="relative shrink-0 mt-0.5">
        <div
          className={`flex size-10 items-center justify-center rounded-full ${
            isListing
              ? "bg-[#D1F2D9] text-[#15803D]"
              : isCancellation
              ? "bg-[#FFEDD5] text-[#EA580C]"
              : isUnread
              ? "bg-[#D1F2D9] text-[#15803D]"
              : "bg-[#F3F4F6] text-neutral-400"
          }`}
        >
          {isListing ? (
            <ShoppingBasket className="size-5" />
          ) : isCancellation ? (
            <Hourglass className="size-5" />
          ) : isUnread ? (
            <ShoppingBasket className="size-5" />
          ) : (
            <Check className="size-5 stroke-[2.5]" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-[15px] font-bold text-neutral-900 group-hover:text-[#1B4D36] transition-colors leading-snug">
            {title}
          </h3>
          {isUnread && (
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                isCancellation
                  ? "bg-[#FFF3E8] text-[#EA580C]"
                  : "bg-[#E8F8ED] text-[#16A34A]"
              }`}
            >
              {isCancellation ? "Expiring" : "New"}
            </span>
          )}
        </div>

        <p className="mt-1 text-[13px] leading-relaxed text-neutral-600">
          {description}
        </p>

        <div className="mt-2.5 flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-neutral-400">
            <Clock className="size-3.5" />
            <span>{formatRelativeTime(notice.createdAt)}</span>
          </span>
          <Link
            href={targetHref}
            onClick={(e) => {
              e.stopPropagation();
              onRead(notice);
            }}
            className={`font-semibold hover:underline cursor-pointer ${
              isCancellation ? "text-[#EA580C]" : "text-[#1B4D36]"
            }`}
          >
            {isListing ? (notice.productAvailable ? "View Details" : "Browse Stall") : isCancellation ? "Show QR Pass" : "View Details"}
          </Link>
        </div>
      </div>
    </article>
  );
};

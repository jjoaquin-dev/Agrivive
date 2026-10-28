"use client";

import Link from "next/link";
import { AlertTriangle, Check, Clock, Hourglass, RefreshCw, ShoppingBasket, Tag } from "lucide-react";
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
  const isPriceDrop = notice.kind === "seller_price_drop";
  const isRestock = notice.kind === "seller_restock";
  const isProduce = isListing || isPriceDrop || isRestock;
  const isCancellation = notice.kind === "seller_cancellation_buyer";
  const isWarning = notice.kind === "trust_action_warning" || notice.kind.includes("warning");
  const isRestriction = notice.kind === "trust_action_restriction" || notice.kind.includes("restriction");
  const isTrustNotice = isWarning || isRestriction;
  const isUnread = !notice.readAt;

  const title = isRestriction
    ? "Reservations Temporarily Paused"
    : isWarning
    ? "Account Notice: Cancellation Advisory"
    : isPriceDrop
    ? `Price Drop: ${notice.productName || "Fresh Produce"}`
    : isRestock
    ? `Back in Stock: ${notice.productName || "Fresh Produce"}`
    : isListing
    ? `New Produce Drop: ${notice.productName || "Fresh Produce"}`
    : isCancellation
    ? "Reservation Expiring Soon"
    : notice.kind === "inquiry_24h_buyer_notice"
    ? "Inquiry Awaiting Seller Response"
    : "Pickup Completed";

  const description = isTrustNotice
    ? (notice.reason || (isRestriction ? "Reservations on your account are temporarily paused." : "Please avoid frequent cancellations to keep your reservations active."))
    : isPriceDrop
    ? `${notice.shopName || "A stall you follow"} lowered the price of ${notice.productName || "produce"}${notice.price ? ` to ₱${notice.price}` : ""}${notice.previousPrice ? ` (was ₱${notice.previousPrice})` : ""}! Reserve yours before stock runs out.`
    : isRestock
    ? `${notice.shopName || "A stall you follow"} restocked fresh ${notice.productName || "produce"}. Available now for stall pickup.`
    : isListing
    ? `${notice.shopName || "A stall you follow"} just listed a new batch of surplus ${notice.productName || "produce"}. Claim yours before it's gone!`
    : isCancellation
    ? `Your reservation for '${notice.productName || "Surplus Produce"}' at ${notice.shopName || "Seller Stall"} expires in 2 hours. Present your QR pass now.`
    : "Thank you for rescuing surplus produce! Your pickup was successfully verified.";

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
    <article
      onClick={() => onRead(notice)}
      className={`group relative flex items-start gap-4 rounded-2xl p-5 transition-all duration-200 cursor-pointer ${
        isRestriction
          ? "border border-rose-200 border-l-[4px] border-l-rose-500 bg-[#FFF9F9] hover:bg-[#FFF5F5]"
          : isWarning
          ? "border border-amber-200 border-l-[4px] border-l-amber-500 bg-[#FFFDF9] hover:bg-[#FFFBF2]"
          : isProduce && isUnread
          ? "border border-[#E2EFE5] border-l-[4px] border-l-[#1B4D36] bg-[#F4FBF6] hover:bg-[#EDF8F0]"
          : isCancellation && isUnread
          ? "border border-[#FCEFE3] border-l-[4px] border-l-[#1B4D36] bg-[#FEFAF6] hover:bg-[#FDF5ED]"
          : isUnread
          ? "border border-neutral-200 border-l-[4px] border-l-[#1B4D36] bg-[#F9FAFB] hover:bg-neutral-50"
          : "border border-neutral-200/70 bg-white hover:border-neutral-300 shadow-2xs"
      }`}
    >
      <div className="relative shrink-0 mt-0.5">
        <div
          className={`flex size-10 items-center justify-center rounded-full ${
            isRestriction
              ? "bg-rose-100 text-rose-700"
              : isWarning
              ? "bg-amber-100 text-amber-700"
              : isPriceDrop
              ? "bg-[#FEF3C7] text-[#D97706]"
              : isRestock
              ? "bg-[#E0F2FE] text-[#0284C7]"
              : isListing || isUnread
              ? "bg-[#D1F2D9] text-[#15803D]"
              : isCancellation
              ? "bg-[#FFEDD5] text-[#EA580C]"
              : "bg-[#F3F4F6] text-neutral-400"
          }`}
        >
          {isTrustNotice ? (
            <AlertTriangle className="size-5" />
          ) : isPriceDrop ? (
            <Tag className="size-5" />
          ) : isRestock ? (
            <RefreshCw className="size-5" />
          ) : isListing ? (
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

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-[15px] font-bold text-neutral-900 group-hover:text-[#1B4D36] transition-colors leading-snug">
            {title}
          </h3>
          {(isUnread || isTrustNotice) && (
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                isRestriction
                  ? "bg-rose-100 text-rose-800"
                  : isWarning
                  ? "bg-amber-100 text-amber-800"
                  : isPriceDrop
                  ? "bg-[#FEF3C7] text-[#B45309]"
                  : isRestock
                  ? "bg-[#E0F2FE] text-[#0369A1]"
                  : isCancellation
                  ? "bg-[#FFF3E8] text-[#EA580C]"
                  : "bg-[#E8F8ED] text-[#16A34A]"
              }`}
            >
              {isRestriction ? "Restriction" : isWarning ? "Advisory" : isPriceDrop ? "Price Drop" : isRestock ? "Restocked" : isCancellation ? "Expiring" : "New"}
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
              isRestriction
                ? "text-rose-600"
                : isWarning
                ? "text-amber-700"
                : isCancellation
                ? "text-[#EA580C]"
                : "text-[#1B4D36]"
            }`}
          >
            {isTrustNotice
              ? "View Orders"
              : isProduce
              ? notice.productAvailable ? "View Details" : "Browse Stall"
              : isCancellation ? "Show QR Pass" : "View Details"}
          </Link>
        </div>
      </div>
    </article>
  );
};

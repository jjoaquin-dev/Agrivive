"use client";

import Link from "next/link";
import { AlertTriangle, Check, Clock, Hourglass, RefreshCw, ShoppingBasket, Tag } from "lucide-react";
import type { BuyerNotice } from "../types";
import { specificTitle } from "../specificTitle";
import { formatRelativeTime } from "../relativeTime";
import { noticeHref } from "../noticeHref";

interface NotificationCardComponentProps {
  notice: BuyerNotice;
  onRead: (notice: BuyerNotice) => void;
}

export const NotificationCardComponent = ({ notice, onRead }: NotificationCardComponentProps) => {
  const isListing = notice.kind === "seller_new_listing";
  const isPriceDrop = notice.kind === "seller_price_drop";
  const isRestock = notice.kind === "seller_restock";
  const isProduce = isListing || isPriceDrop || isRestock;
  const isCancellation = notice.kind === "seller_cancellation_buyer";
  const isWarning = notice.kind === "trust_action_warning" || notice.kind.includes("warning");
  const isRestriction = notice.kind === "trust_action_restriction" || notice.kind.includes("restriction");
  const isTrustNotice = (isWarning || isRestriction) && !notice.kind.startsWith("trust_event");
  const genericTitles: Record<string, string> = { order_update: "Order update", trust_event: "Trust update", trust_decision: "Decision on your case", trust_level_lowered: "Restriction ended", trust_action_notice: "Trust notice" };
  const isGeneric = notice.kind in genericTitles;
  const isUnread = !notice.readAt;

  const isInquiryReply = notice.kind === "seller_inquiry_reply";
  const isReviewReply = notice.kind === "seller_review_reply";
  const isChatReply = notice.kind === "seller_chat_reply";
  const isReply = isInquiryReply || isReviewReply || isChatReply;

  const title = specificTitle(notice) ?? (isGeneric
    ? genericTitles[notice.kind]
    : isInquiryReply
    ? "Seller Answered Your Question"
    : isReviewReply
    ? `Seller ${notice.shopName || ""} replied to your feedback${notice.orderId ? ` in your order RSV-${notice.orderId.slice(0, 4).toUpperCase()}` : ""}`.replace("Seller  ", "Seller ")
    : isChatReply
    ? "New Reply From a Seller"
    : isRestriction
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
    : "Pickup Completed");

  const description = isGeneric
    ? (notice.reason ?? "")
    : isInquiryReply
    ? "A seller answered your question. Open it to read the reply."
    : isReviewReply
    ? "A seller wrote a reply to the review you left."
    : isChatReply
    ? "A seller sent you a message. Open your chat to read it."
    : isTrustNotice
    ? (notice.reason || (isRestriction ? "Reservations on your account are temporarily paused." : "Please avoid frequent cancellations to keep your reservations active."))
    : isPriceDrop
    ? `${notice.shopName || "A stall you follow"} lowered the price of ${notice.productName || "produce"}${notice.price ? ` to ₱${notice.price}` : ""}${notice.previousPrice ? ` (was ₱${notice.previousPrice}${Number(notice.previousPrice) > Number(notice.price) && Number(notice.price) > 0 ? `, ${Math.round(((Number(notice.previousPrice) - Number(notice.price)) / Number(notice.previousPrice)) * 100)}% off` : ""})` : ""}! Reserve yours before stock runs out.`
    : isRestock
    ? `${notice.shopName || "A stall you follow"} restocked fresh ${notice.productName || "produce"}. Available now for stall pickup.`
    : isListing
    ? `${notice.shopName || "A stall you follow"} just listed a new batch of surplus ${notice.productName || "produce"}. Claim yours before it's gone!`
    : isCancellation
    ? `Your reservation for '${notice.productName || "Surplus Produce"}' at ${notice.shopName || "Seller Stall"} expires in 2 hours. Present your QR pass now.`
    : "Thank you for rescuing surplus produce! Your pickup was successfully verified.";

  const targetHref = noticeHref(notice, isTrustNotice);

  return (
    <article
      onClick={() => onRead(notice)}
      className={`group relative flex items-start gap-4 rounded-2xl p-5 transition-all duration-200 cursor-pointer ${
        isRestriction
          ? "border border-rose-200 border-l-[4px] border-l-rose-500 bg-[#FFF9F9] hover:bg-[#FFF5F5]"
          : isWarning
          ? "border border-amber-200 border-l-[4px] border-l-amber-500 bg-[#FFFDF9] hover:bg-[#FFFBF2]"
          : isProduce && isUnread
          ? "border border-[#E2EFE5] border-l-[4px] border-l-agrivive-forest bg-[#F4FBF6] hover:bg-[#EDF8F0]"
          : isCancellation && isUnread
          ? "border border-[#FCEFE3] border-l-[4px] border-l-agrivive-forest bg-[#FEFAF6] hover:bg-[#FDF5ED]"
          : isUnread
          ? "border border-neutral-200 border-l-[4px] border-l-agrivive-forest bg-agrivive-wash hover:bg-neutral-50"
          : "border border-neutral-200/70 bg-white hover:border-neutral-300 shadow-sm"
      }`}
    >
      <div className="relative shrink-0 mt-0.5">
        <div
          className={`flex size-10 items-center justify-center rounded-full ${
            isRestriction
              ? "bg-rose-100 text-destructive"
              : isWarning
              ? "bg-amber-100 text-amber-700"
              : isPriceDrop
              ? "bg-[#FEF3C7] text-amber-600"
              : isRestock
              ? "bg-[#E0F2FE] text-[#0284C7]"
              : isListing || isUnread
              ? "bg-[#D1F2D9] text-[#15803D]"
              : isCancellation
              ? "bg-[#FFEDD5] text-orange-600"
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
            <Check className="size-5" />
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-sm font-bold text-neutral-900 group-hover:text-agrivive-forest transition-colors leading-snug">
            {title}
          </h3>
          {(isUnread || isTrustNotice) && (
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isRestriction
                  ? "bg-rose-100 text-rose-800"
                  : isWarning
                  ? "bg-amber-100 text-amber-800"
                  : isPriceDrop
                  ? "bg-[#FEF3C7] text-amber-700"
                  : isRestock
                  ? "bg-[#E0F2FE] text-[#0369A1]"
                  : isCancellation
                  ? "bg-[#FFF3E8] text-orange-600"
                  : "bg-[#E8F8ED] text-green-600"
              }`}
            >
              {isRestriction ? "Restriction" : isWarning ? "Advisory" : isPriceDrop ? "Price Drop" : isRestock ? "Restocked" : isCancellation ? "Expiring" : "New"}
            </span>
          )}
        </div>

        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
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
                ? "text-orange-600"
                : "text-agrivive-forest"
            }`}
          >
            {isReply
              ? isReviewReply ? "View Review" : "Read Reply"
              : isTrustNotice
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

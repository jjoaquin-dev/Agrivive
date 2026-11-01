"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Phone, Store, User } from "lucide-react";
import type { ConversationLaunchContext } from "../types";
import type { Conversation } from "../api";
import { ConversationStateButtons } from "./ConversationStateActions";

export function ConversationDetailsPanel({
  context,
  conversation,
  onStateChanged,
  className = "",
}: {
  context: ConversationLaunchContext;
  conversation?: Conversation | null;
  onStateChanged?: () => void;
  className?: string;
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const shopName = context.sellerShopName || context.sellerName || "Market Stall";
  const initials = shopName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stallId = `STALL-${context.sellerId.slice(0, 6).toUpperCase()}`;

  return (
    <aside
      data-lenis-prevent
      className={`flex h-full w-full flex-col overflow-y-auto rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm ${className}`}
      aria-label="Conversation details"
    >
      {/* Vendor Profile Hero */}
      <div className="flex flex-col items-center pt-2 pb-4 text-center">
        <div className="relative size-20">
          <div className="size-full overflow-hidden rounded-full border border-neutral-200/80 shadow-sm">
            {context.sellerImage && !avatarFailed ? (
              <Image
                src={context.sellerImage}
                alt={shopName}
                fill
                className="object-cover"
                unoptimized
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-[#F3F4F6] font-heading text-lg font-bold text-neutral-700">
                {initials}
              </div>
            )}
          </div>
          <span className="absolute bottom-0.5 right-0.5 size-4 rounded-full border-2 border-white bg-[#16A34A]" />
        </div>

        <h4 className="mt-3 font-heading text-lg font-bold text-neutral-900">{shopName}</h4>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#16A34A]">
          <Check className="size-3.5" />
          <span>Verified vendor</span>
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
          <Phone className="size-3.5 text-neutral-400" />
          <span>+63 912-345-6789</span>
        </p>

        {/* Quick Action Button */}
        <div className="mt-4 w-full">
          <Link
            href={`/sellers/${context.sellerId}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-2.5 text-xs font-bold text-neutral-900 transition hover:bg-neutral-50 shadow-sm"
          >
            <User className="size-3.5 text-neutral-600" />
            <span>Profile</span>
          </Link>
        </div>

        {/* Archive and block for this chat */}
        {conversation && onStateChanged ? (
          <div className="mt-3 w-full">
            <ConversationStateButtons conversation={conversation} onChanged={onStateChanged} />
          </div>
        ) : null}
      </div>

      <div className="h-px bg-neutral-100 my-2" />

      {/* Stall Information Section */}
      <div className="py-2.5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Stall Information
          </span>
          <ChevronRight className="size-3.5 text-neutral-400" />
        </div>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Stall ID</span>
            <span className="font-semibold text-neutral-900">{stallId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Location</span>
            <span className="font-medium text-neutral-700">Bankerohan Market</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">City</span>
            <span className="font-medium text-neutral-700">Davao City</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Status</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-[#16A34A]">
              <span className="size-2 rounded-full bg-[#16A34A]" />
              <span>Verified Stall</span>
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-neutral-100 my-2" />

      {/* Inquired Produce Section */}
      {context.productId && (
        <div className="py-2.5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Inquired Produce
            </span>
            <Link
              href={`/marketplace/${context.productId}`}
              className="text-xs font-bold text-[#16A34A] hover:underline"
            >
              VIEW &gt;
            </Link>
          </div>
          <Link
            href={`/marketplace/${context.productId}`}
            className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-[#F9FAFB] p-2.5 transition hover:bg-[#F3F4F6]"
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200/80 bg-white flex items-center justify-center">
              {context.productImageUrl ? (
                <img src={context.productImageUrl} alt="" className="size-full object-cover" />
              ) : (
                <Store className="size-5 text-[#16A34A]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-neutral-900">
                {context.productName || "Fresh Produce"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                {context.productPrice != null && (
                  <span className="font-semibold text-neutral-700">
                    ₱{Number(context.productPrice).toFixed(2)}
                    {context.scalingType ? `/${context.scalingType}` : ""}
                  </span>
                )}
                {context.productQty != null && (
                  <span>• {Number(context.productQty) > 0 ? `${Number(context.productQty)} ${context.scalingType || "unit"}` : "Sold out"}</span>
                )}
              </div>
            </div>
            <span className="size-2 rounded-full bg-[#16A34A] shrink-0" />
          </Link>
        </div>
      )}
    </aside>
  );
}

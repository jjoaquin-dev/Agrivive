"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, MoreHorizontal, Phone, ShieldCheck, Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ConversationLaunchContext } from "../types";

export function ConversationDetailsPanel({
  context,
  className = "",
}: {
  context: ConversationLaunchContext;
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
      className={`flex min-h-[680px] w-full flex-col border-l border-border/80 bg-white p-5 ${className}`}
      aria-label="Conversation details"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-4">
        <h3 className="font-heading text-base font-bold text-foreground">Chat Details</h3>
        <button
          type="button"
          aria-label="Options"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      {/* Seller Avatar & Identity */}
      <div className="flex flex-col items-center py-6 text-center">
        <div className="relative size-20 overflow-hidden rounded-full border-2 border-border/80 bg-gradient-to-br from-agrivive-primary/10 to-agrivive-sage/20 shadow-xs">
          {context.sellerImage && !avatarFailed ? (
            <Image
              src={context.sellerImage}
              alt={shopName}
              fill
              className="object-cover object-center"
              unoptimized
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="flex size-full items-center justify-center font-heading text-xl font-bold text-agrivive-primary">
              {initials}
            </div>
          )}
        </div>
        <h4 className="mt-3 font-heading text-base font-bold text-foreground">{shopName}</h4>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Phone className="size-3 text-agrivive-primary" />
          +63 912-345-6789
        </p>
      </div>

      {/* Contact & Stall Information Card */}
      <Card className="rounded-2xl border-border/70 bg-agrivive-background/50 p-4 shadow-none">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Stall Information
        </p>
        <div className="mt-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stall ID</span>
            <span className="font-mono font-semibold text-foreground">{stallId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location</span>
            <span className="font-medium text-foreground">Bankerohan Market</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">City</span>
            <span className="font-medium text-foreground">Davao City</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <ShieldCheck className="size-3 text-emerald-600" />
              Verified Stall
            </span>
          </div>
        </div>
      </Card>

      {/* Active Produce Listing Context */}
      {context.productId && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Inquired Produce</span>
            <Link
              href={`/marketplace/${context.productId}`}
              className="inline-flex items-center text-agrivive-primary hover:underline"
            >
              View <ChevronRight className="size-3" />
            </Link>
          </div>
          <Link
            href={`/marketplace/${context.productId}`}
            className="group flex items-center gap-3 rounded-xl border border-border/70 p-2.5 transition hover:bg-agrivive-background"
          >
            {context.productImageUrl ? (
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={context.productImageUrl}
                  alt={context.productName || "Produce"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-agrivive-background text-agrivive-primary">
                <Store className="size-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground group-hover:text-agrivive-primary">
                {context.productName || "Surplus Produce"}
              </p>
              <p className="text-[11px] text-muted-foreground">Active marketplace listing</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}

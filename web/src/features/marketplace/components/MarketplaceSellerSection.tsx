"use client";

import { useState } from "react";
import { ChevronRight, Maximize2 } from "lucide-react";
import type { MarketplaceSellerMapResult } from "../types";
import { InteractiveSellerMap } from "./InteractiveSellerMap";
import { SellerMapModal } from "./SellerMapModal";

type MarketplaceSellerSectionProps = {
  sellers: MarketplaceSellerMapResult[];
  unmappedSellerCount: number;
  latitude: number | null;
  longitude: number | null;
  radiusKm: number | null;
  selectedSellerId: string | null;
  loading: boolean;
  error: string;
  onSelectSeller: (sellerId: string) => void;
  onRetry: () => void;
  onCloseMap?: () => void;
};

export function MarketplaceSellerSection(props: MarketplaceSellerSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sellerList = props.sellers.map((s) => {
    const marketLocation = s.detailAddress
      ? s.detailAddress.split(",")[0].replace(/^Stall\s*#__,\s*/i, "").trim()
      : "Davao City";
    const locationText = s.distanceKm !== null ? `${s.distanceKm.toFixed(1)} km away` : marketLocation;

    return {
      id: s.id,
      name: s.shopName,
      ownerName: s.name,
      count: s.productCount,
      distance: locationText,
      rating: "4.9",
      avatar: s.image,
      initials: (s.shopName || s.name || "ST").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    };
  });

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-neutral-200/80 bg-[linear-gradient(135deg,rgba(254,169,56,0.04)_0%,rgba(252,236,154,0.08)_20%,rgba(255,255,255,0.96)_50%,rgba(198,199,54,0.05)_75%,rgba(69,125,0,0.035)_100%)] p-5 sm:p-6 lg:p-[28px] shadow-sm">
      {/* Background Palette Ambient Glow Orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 -left-16 size-64 rounded-full bg-[#FEA938]/4 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 left-1/3 size-64 rounded-full bg-[#FCEC9A]/8 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-12 right-1/4 size-60 rounded-full bg-[#C6C736]/4 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-16 size-72 rounded-full bg-[#457D00]/3 blur-3xl" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[352px_1fr] lg:items-stretch">
        {/* Left Column: Stall Hub Selector */}
        <div className="flex flex-col px-1">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#457D00]">
              Near you
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[#14231A]">
              Find a seller nearby
            </h2>
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-[#5F7367]">
            Select a pin or a seller card to compare pickup spots and available produce.
          </p>

          <div className="mt-4 space-y-2.5">
            {props.loading && sellerList.length === 0 ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-white/70" />
                ))}
              </div>
            ) : sellerList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 p-5 text-center">
                <p className="font-heading text-sm font-semibold text-[#14231A]">
                  No local stalls found
                </p>
                <p className="mt-1 text-xs text-[#5F7367]">
                  Check your location filter or browse the harvest listings below.
                </p>
              </div>
            ) : (
              sellerList.map((seller) => {
                const isSelected = props.selectedSellerId === seller.id;

                return (
                  <button
                    key={seller.id}
                    type="button"
                    onClick={() => props.onSelectSeller(seller.id)}
                    className={`group relative flex h-[80px] w-full items-center justify-between rounded-[16px] border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                      isSelected
                        ? "border-[#457D00] border-l-4 border-l-[#457D00] bg-gradient-to-r from-[#F0F7ED] via-white to-white shadow-xs"
                        : "border-neutral-200/80 bg-white hover:border-[#96B125]/40 hover:bg-[#FAF9F5]/70"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Seller Photo Avatar with Fallback Initials */}
                      <div className="relative size-[44px] shrink-0 overflow-hidden rounded-full ring-2 ring-neutral-200/80 transition-transform duration-200 group-hover:scale-105 group-hover:ring-[#457D00]/40">
                        {seller.avatar ? (
                          <img
                            src={seller.avatar}
                            alt={`${seller.name} avatar`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : null}
                        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-[#EDF2EB] font-heading text-xs font-bold text-[#457D00]">
                          {seller.initials}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Name & Star Rating Badge */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading text-sm font-bold text-[#14231A] transition-colors group-hover:text-[#457D00] truncate">
                            {seller.name}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#FEA938]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#B45309]">
                            ⭐ {seller.rating}
                          </span>
                        </div>

                        {/* Listings & Distance */}
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-[#5F7367]">
                          <span className="font-semibold text-neutral-800 shrink-0">
                            {seller.count} {seller.count === 1 ? "listing" : "listings"}
                          </span>
                          <span className="text-neutral-300">•</span>
                          <span className="truncate">{seller.distance}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Chevron */}
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                        isSelected
                          ? "bg-[#457D00] text-white shadow-2xs"
                          : "bg-neutral-100 text-neutral-400 group-hover:bg-[#457D00] group-hover:text-white"
                      }`}
                    >
                      <ChevronRight className="size-4" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Embedded Map aligned with Near you and 3rd card */}
        <div className="relative isolate z-0 flex h-full min-h-[350px] w-full flex-col overflow-hidden rounded-[16px] border border-neutral-200/80 bg-[#fdfdfd] shadow-2xs">
          {/* Map Top-Right Expand Overlay Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-lg border border-neutral-200/90 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-[#14231A] shadow-sm backdrop-blur-xs transition hover:bg-white hover:text-[#457D00] hover:shadow active:scale-95 cursor-pointer"
            title="Expand map in full modal view"
          >
            <Maximize2 className="size-3.5 text-[#457D00]" />
            <span>Expand</span>
          </button>

          <InteractiveSellerMap
            {...props}
            hideHeader
            mapHeightClassName="h-full min-h-[350px] w-full"
          />
        </div>
      </div>

      {/* Full Map Modal */}
      {isModalOpen ? (
        <SellerMapModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          {...props}
        />
      ) : null}
    </section>
  );
}

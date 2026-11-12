"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { MarketplaceSellerMapResult } from "../types";
import { InteractiveSellerMap } from "./InteractiveSellerMap";

interface SellerMapModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export function SellerMapModal({ isOpen, onClose, ...mapProps }: SellerMapModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5" role="dialog" aria-modal="true" aria-label="Seller location">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 flex h-[90vh] max-h-[720px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div>
              <p className="type-eyebrow text-agrivive-primary">
                Explore Local Stalls
              </p>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-agrivive-ink">
                Find a seller nearby
              </h2>
            </div>
            <span className="hidden sm:inline-flex rounded-full border border-agrivive-primary/20 bg-agrivive-mist px-2.5 py-0.5 text-xs font-semibold text-agrivive-primary">
              {mapProps.sellers.length} {mapProps.sellers.length === 1 ? "seller" : "sellers"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Map View */}
        <div className="relative flex-1 w-full bg-agrivive-paper overflow-hidden">
          <InteractiveSellerMap
            {...mapProps}
            hideHeader
            mapHeightClassName="h-full w-full min-h-[440px]"
          />
        </div>
      </div>
    </div>
  );
}

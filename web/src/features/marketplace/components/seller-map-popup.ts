import { getDirectionsUrl } from "@/src/lib/maps";
import type { MarketplaceSellerMapResult } from "../types";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function sellerInitials(seller: MarketplaceSellerMapResult) {
  return (seller.name || seller.shopName)
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function sellerTypeLabel(sellerType: MarketplaceSellerMapResult["sellerType"]) {
  return {
    supplier: "Supplier",
    supplier_vendor: "Supplier vendor",
    retail_vendor: "Retail vendor",
  }[sellerType];
}

export function sellerMapPopupContent(seller: MarketplaceSellerMapResult) {
  const directionsUrl = getDirectionsUrl(seller.latitude, seller.longitude);
  const avatar = `<div class="relative flex h-[44px] w-[44px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#EDF2EB] text-sm font-bold text-[#457D00] ring-1 ring-[#457D00]/10">
    ${seller.image ? `<img src="${escapeHtml(seller.image)}" alt="${escapeHtml(`${seller.shopName} seller profile`)}" class="h-full w-full object-cover" onerror="this.hidden=true;this.nextElementSibling.hidden=false;" />` : ""}
    <span${seller.image ? " hidden" : ""}>${escapeHtml(sellerInitials(seller))}</span>
  </div>`;
  const distance =
    seller.distanceKm === null
      ? ""
      : `<span class="inline-flex items-center gap-1 rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-[11px] font-medium text-[#5C6460] border border-[#E5E2DA]">
          <svg class="w-3 h-3 text-[#457D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          ${seller.distanceKm.toFixed(1)} km away
        </span>`;

  const itemCountText =
    seller.productCount === 1 ? "1 fresh item" : `${seller.productCount} fresh items`;

  const directionsButton = directionsUrl
    ? `<a
        class="inline-flex h-10 flex-1 items-center justify-center rounded-[12px] border border-[#E5E2DA] bg-white px-3 text-xs font-semibold text-[#457D00] transition hover:bg-[#FAF8F5] active:scale-[0.98]"
        style="color: #457D00 !important; text-decoration: none !important;"
        target="_blank"
        rel="noreferrer"
        href="${directionsUrl}"
      >
        Directions
      </a>`
    : "";

  return `<div class="w-[320px] p-4 text-[#212523] antialiased">
    <div class="flex items-center gap-[10px]">
      ${avatar}
      <div class="min-w-0 flex flex-col justify-center">
        <h3 class="font-heading text-lg font-bold leading-tight text-[#457D00]">
          ${escapeHtml(seller.shopName)}
        </h3>
        <div class="mt-1 truncate text-xs text-[#5C6460]">
          ${escapeHtml(seller.name)} · ${escapeHtml(sellerTypeLabel(seller.sellerType))}
        </div>
      </div>
    </div>
    <div class="mt-3.5 text-xs leading-snug text-[#5C6460]" style="margin-top: 14px !important;">
      ${escapeHtml(seller.detailAddress)}
    </div>

    <div class="mt-2.5 flex flex-wrap items-center gap-1.5" style="margin-top: 10px !important;">
      <span class="inline-flex items-center gap-0.5 rounded-full bg-[#FEA938]/15 px-2 py-0.5 text-[11px] font-bold text-[#B45309]">
        ⭐ ${typeof seller.rating === "number" && seller.rating > 0 ? seller.rating.toFixed(1) : "0"}
      </span>
      <span class="inline-flex items-center rounded-full border border-[#457D00]/10 bg-[#EDF2EB] px-2.5 py-0.5 text-[11px] font-semibold text-[#457D00]">
        ${itemCountText}
      </span>
      ${distance}
    </div>

    <div class="mt-3 flex items-center gap-2 pt-3 border-t border-[#E5E2DA]">
      <a
        class="inline-flex h-10 flex-1 items-center justify-center rounded-[12px] bg-[#457D00] px-3 text-xs font-semibold text-white shadow-xs transition hover:bg-[#386600] active:scale-[0.98]"
        style="color: #ffffff !important; text-decoration: none !important;"
        href="/sellers/${encodeURIComponent(seller.id)}"
      >
        View stall
      </a>
      ${directionsButton}
    </div>
  </div>`;
}

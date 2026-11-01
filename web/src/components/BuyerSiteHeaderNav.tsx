"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "./PageContainer";
import { MarketplaceHeaderFilters } from "@/src/features/marketplace/components/MarketplaceHeaderFilters";

// One list drives the category row on every buyer page.
const produceCategories = [
  { label: "All produce", value: "" },
  { label: "Leafy greens", value: "Leafy Greens" },
  { label: "Fruit vegetables", value: "Fruit Vegetables" },
  { label: "Root vegetables", value: "Root Vegetables" },
  { label: "Pod vegetables", value: "Pod Vegetables" },
  { label: "Tuber vegetables", value: "Tuber Vegetables" },
  { label: "Bulb vegetables", value: "Bulb Vegetables" },
];

type BuyerSiteHeaderNavProps = {
  menuOpen: boolean;
  onGreen?: boolean;
  hasSession: boolean;
  onCloseMenu: () => void;
};

export function BuyerSiteHeaderNav({ menuOpen, onCloseMenu, onGreen = false, hasSession }: BuyerSiteHeaderNavProps) {
  const searchParams = useSearchParams();
  const selectedType = searchParams?.get("productType") ?? "";

  return (
    <>
      {/* Sub Navigation Bar (Produce Categories) */}
      <div className={`hidden md:block border-t py-2.5 ${onGreen ? "border-white/20" : "border-neutral-100"}`}>
        <PageContainer className="flex items-center justify-center">
          <nav className={`flex items-center gap-5 whitespace-nowrap text-xs font-semibold xl:gap-7 ${onGreen ? "text-white/85" : "text-neutral-600"}`}>
            {produceCategories.map((cat) => {
              const isActive = selectedType === cat.value || (!selectedType && cat.value === "");
              const href = cat.value
                ? `/marketplace?productType=${encodeURIComponent(cat.value)}`
                : "/marketplace";

              return (
                <Link
                  key={cat.label}
                  href={href}
                  className={`pb-1 transition-all ${
                    isActive
                      ? (onGreen ? "border-b-2 border-white font-bold text-white" : "border-b-2 border-[#457D00] font-bold text-[#457D00]")
                      : (onGreen ? "border-b-2 border-transparent hover:text-white" : "border-b-2 border-transparent hover:text-[#457D00]")
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>
          {/* Price and distance under 1280px; the navbar shows them above that. */}
          <div className="flex items-center gap-2 xl:hidden">
            <MarketplaceHeaderFilters />
          </div>
        </PageContainer>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-t border-neutral-200 p-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {/* Price and distance on phones and tablets. */}
            <div className="flex flex-wrap gap-2 md:hidden">
              <MarketplaceHeaderFilters />
            </div>
            {/* Phone header has no search box, so point to the marketplace search. */}
            <Link href="/marketplace" onClick={onCloseMenu} className="mb-2 inline-flex min-h-11 items-center rounded-xl border border-neutral-200 px-3 text-xs font-semibold text-neutral-800">
              Search produce on the marketplace
            </Link>
            {!hasSession ? (
              // Guest buttons live here below the desktop breakpoint, where the top bar has no room.
              <div className="mb-2 flex gap-2">
                <Link href="/login" onClick={onCloseMenu} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800">
                  Sign in
                </Link>
                <Link href="/signup" onClick={onCloseMenu} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#457D00] text-xs font-semibold text-white">
                  Register
                </Link>
              </div>
            ) : null}
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Categories
            </p>
            <Link
              href="/marketplace/overview"
              onClick={onCloseMenu}
              className="py-1.5 text-xs font-bold text-[#457D00] hover:underline"
            >
              Public Marketplace Overview
            </Link>
            {produceCategories.map((cat) => {
              const isActive = selectedType === cat.value || (!selectedType && cat.value === "");
              const href = cat.value
                ? `/marketplace?productType=${encodeURIComponent(cat.value)}`
                : "/marketplace";

              return (
                <Link
                  key={cat.label}
                  href={href}
                  onClick={onCloseMenu}
                  className={`py-1.5 text-xs font-semibold ${
                    isActive ? "font-bold text-[#457D00]" : "text-neutral-700 hover:text-[#457D00]"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export function BuyerSiteHeaderNavFallback({ menuOpen }: { menuOpen: boolean }) {
  return menuOpen
    ? <div className="h-12 border-t lg:hidden" aria-hidden="true" />
    : <div className="hidden h-12 border-t md:block" aria-hidden="true" />;
}

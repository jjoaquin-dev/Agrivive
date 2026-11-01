"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "./PageContainer";

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

export function BuyerSiteHeaderNav({ menuOpen, onCloseMenu, onGreen = false }: BuyerSiteHeaderNavProps) {
  const searchParams = useSearchParams();
  const selectedType = searchParams?.get("productType") ?? "";

  return (
    <>
      {/* Sub Navigation Bar (Produce Categories) */}
      <div className={`hidden md:block border-t py-2.5 ${onGreen ? "border-white/20" : "border-neutral-100"}`}>
        <PageContainer className="flex items-center justify-center">
          <nav className={`flex items-center gap-7 text-xs font-semibold ${onGreen ? "text-white/85" : "text-neutral-600"}`}>
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
        </PageContainer>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-t border-neutral-200 p-4 md:hidden">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
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
    ? <div className="h-12 border-t md:hidden" aria-hidden="true" />
    : <div className="hidden h-12 border-t md:block" aria-hidden="true" />;
}

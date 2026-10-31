"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronDown, Search, ShieldCheck } from "lucide-react";

const searchCategories = [
  "All Categories",
  "Leafy Greens",
  "Fruit Vegetables",
  "Root Vegetables",
  "Pod Vegetables",
  "Tuber Vegetables",
  "Bulb Vegetables",
];

const popularSearches = [
  { label: "Tomatoes", query: "Tomatoes" },
  { label: "Carrots", query: "Carrots" },
  { label: "Eggplant", query: "Eggplant" },
  { label: "Ampalaya", query: "Ampalaya" },
  { label: "Bok Choy", query: "Bok Choy" },
];

export function HomeFinalCta() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "All Categories") params.set("productType", selectedCategory);
    router.push(`/marketplace?${params.toString()}`);
  };

  const handleQuickSearch = (query: string) => {
    router.push(`/marketplace?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl bg-[#457D00] bg-[url(/brand/final-cta-pattern.webp)] bg-cover bg-center text-white sm:rounded-[32px]"
        >
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-14 text-center sm:px-12 sm:py-20">
            <h2 className="type-section font-heading text-white tracking-tight">Start Shopping Today’s Surplus</h2>

            <p className="type-lede mt-4 max-w-xl text-white/85">
              Join Davao buyers who save on surplus produce straight from neighborhood stalls.
            </p>

            {/* Search Bar (Fitts's Law: 48px primary action) */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 flex w-full max-w-2xl items-center rounded-full bg-white p-1.5 pl-5 text-left transition-shadow focus-within:ring-4 focus-within:ring-[#B8EB5E]/40 sm:mt-10"
            >
              <Search className="size-5 shrink-0 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search surplus vegetables"
                placeholder="Search surplus vegetables (e.g. tomatoes, eggplant)..."
                className="min-w-0 w-full bg-transparent px-3 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
              />

              {/* Category Selector Divider */}
              <div className="hidden sm:flex relative items-center border-l border-neutral-200 pl-3 pr-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Product category"
                  className="appearance-none bg-transparent pr-6 text-xs font-semibold text-neutral-700 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none cursor-pointer"
                >
                  {searchCategories.map((cat) => (
                    <option key={cat} value={cat} className="text-neutral-900">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 size-3.5 text-neutral-400" />
              </div>

              {/* Search Action Button */}
              <button
                type="submit"
                className="flex h-12 items-center gap-1.5 rounded-full bg-[#1F4D3A] px-5 sm:px-7 font-heading text-sm font-bold text-white transition hover:bg-[#173A2B] active:scale-95 cursor-pointer shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            {/* Popular Search Chips (Recognition Over Recall) */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="font-semibold text-white">Popular:</span>
              {popularSearches.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleQuickSearch(item.query)}
                  className="min-h-9 rounded-full border border-white/25 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/15 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Trust assurances and catalog link */}
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-black/10 px-5 py-4 sm:flex-row sm:justify-center sm:gap-6">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/90">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-[#B8EB5E]" aria-hidden="true" /> 24-Hour QR Holds
                </span>
                <span aria-hidden="true">•</span>
                <span>Direct Stall Pickup</span>
                <span aria-hidden="true">•</span>
                <span>Zero Upfront Payments</span>
              </div>

              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1.5 font-heading text-sm font-bold text-white underline underline-offset-4 transition hover:text-[#E2FD56]"
              >
                <span>Browse Full Marketplace Catalog</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

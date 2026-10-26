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
    <section className="bg-white py-16 sm:py-24 border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Modern Elevated Botanical Card */}
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[#457D00] px-6 py-14 sm:px-12 sm:py-20 text-center text-white shadow-2xl border border-[#386600]">
          {/* Subtle Ambient Radial Lighting */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-[#457D00]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 size-96 rounded-full bg-[#FEA938]/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            {/* Headline */}
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Start Shopping Today’s Harvest
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-200 max-w-xl mx-auto">
              Join conscious Davao buyers and support local growers while enjoying up to 50% off fresh surplus produce directly from neighborhood stalls.
            </p>

            {/* Integrated Search Bar (Matching Navbar Style) */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 sm:mt-10 mx-auto flex w-full max-w-2xl items-center rounded-full bg-white p-1.5 pl-5 shadow-2xl transition-all focus-within:ring-4 focus-within:ring-[#B8EB5E]/30"
            >
              <Search className="size-5 shrink-0 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search surplus vegetables (e.g. tomatoes, eggplant)..."
                className="w-full bg-transparent px-3 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
              />

              {/* Category Selector Divider */}
              <div className="hidden sm:flex relative items-center border-l border-neutral-200 pl-3 pr-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
                className="flex items-center gap-1.5 rounded-full bg-[#457D00] px-5 sm:px-6 py-3 font-heading text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-[#386600] active:scale-95 cursor-pointer shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="size-3.5" />
              </button>
            </form>

            {/* Popular Search Chips (Recognition Over Recall) */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="font-semibold text-neutral-300">Popular:</span>
              {popularSearches.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleQuickSearch(item.query)}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-xs hover:bg-white/20 hover:text-white transition cursor-pointer border border-white/10"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Secondary Action & Trust Assurances */}
            <div className="mt-10 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-300">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-[#B8EB5E]" /> 24-Hour QR Holds
                </span>
                <span>•</span>
                <span>Direct Stall Pickup</span>
                <span>•</span>
                <span>Zero Upfront Payments</span>
              </div>

              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1.5 font-heading text-xs sm:text-sm font-bold text-[#B8EB5E] hover:text-[#d3f596] transition underline underline-offset-4"
              >
                <span>Browse Full Marketplace Catalog</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

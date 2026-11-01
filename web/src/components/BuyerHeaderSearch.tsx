"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { MarketplaceHeaderFilters } from "@/src/features/marketplace/components/MarketplaceHeaderFilters";
import { HeaderCategoryDropdown } from "./HeaderCategoryDropdown";

const navCategories = [
  "All Categories",
  "Leafy Greens",
  "Fruit Vegetables",
  "Root Vegetables",
  "Pod Vegetables",
  "Tuber Vegetables",
  "Bulb Vegetables",
];

// Navbar search. On the marketplace it also shows the price and distance dropdowns beside the category.
export function BuyerHeaderSearch({ onGreen }: { onGreen: boolean }) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const onMarketplace = pathname.startsWith("/marketplace");
  const search = searchParams?.get("search") ?? "";
  const productType = searchParams?.get("productType") ?? "";
  const [searchQuery, setSearchQuery] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState(navCategories.includes(productType) ? productType : "All Categories");

  // Keep the fields in step with the URL (for example after a category link or Reset).
  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  useEffect(() => {
    setSelectedCategory(navCategories.includes(productType) ? productType : "All Categories");
  }, [productType]);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    // Keep price and distance on the marketplace; other pages start a fresh search.
    const params = new URLSearchParams(onMarketplace ? searchParams?.toString() : "");
    params.delete("cursor");
    params.delete("search");
    params.delete("productType");
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "All Categories") params.set("productType", selectedCategory);
    router.push(`/marketplace?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`hidden min-w-0 md:flex flex-1 items-center rounded-full border p-1 pl-4 transition-all focus-within:border-[#457D00] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#457D00]/20 ${
        onGreen ? "max-w-4xl border-white bg-white" : "max-w-xl border-neutral-300 bg-neutral-50/70"
      }`}
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search vegetable name..."
        className="min-w-[120px] w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-500 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
      />
      <HeaderCategoryDropdown
        categories={navCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      {/* Shows here from 1280px up. Below that the filters sit in the category row or the menu. */}
      <div className="hidden xl:contents">
        <MarketplaceHeaderFilters />
      </div>
      <button
        type="submit"
        className="ml-1 flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#457D00] px-4 text-xs font-bold text-white transition-colors hover:bg-[#457D00]/90 cursor-pointer"
      >
        <Search aria-hidden="true" className="size-4" />
        <span>Search</span>
      </button>
    </form>
  );
}

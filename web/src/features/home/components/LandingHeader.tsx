"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import { PageContainer } from "@/src/components/PageContainer";
import { HeaderCategoryDropdown } from "@/src/components/HeaderCategoryDropdown";
import { authClient } from "@/src/lib/auth-client";

const navCategories = ["All Categories", "Vegetables", "Fruits", "Leafy Greens", "Root Crops"];

const sectionLinks = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace", isRoute: true },
  { label: "Public Marketplace Overview", href: "/marketplace/overview", isRoute: true },
  { label: "Categories", href: "#categories" },
  { label: "Live Surplus", href: "#live-inventory" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why Surplus?", href: "#why-surplus" },
  { label: "FAQ", href: "#faq" },
];

export function LandingHeader() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { data: session } = authClient.useSession();
  const hasSession = Boolean(session?.user);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "All Categories") params.set("productType", selectedCategory);
    router.push(`/marketplace?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/95 backdrop-blur shadow-xs">
      {/* Top Main Bar */}
      <div className="border-b border-neutral-100 py-2.5">
        <PageContainer className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-1.5" aria-label="Agrivive home">
            <Image src="/brand/agrivive-logo-full-new.png" alt="Agrivive" width={130} height={36} className="h-[36px] w-auto object-contain transition-transform group-hover:scale-105" priority />
          </Link>

          {/* Integrated Search Bar (PioMart Style) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl items-center rounded-full border border-neutral-300 bg-neutral-50/70 p-1 pl-4 transition-all focus-within:border-[#457D00] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#457D00]/20">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vegetable name..."
              className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
            />
            <HeaderCategoryDropdown
              categories={navCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <button
              type="submit"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#457D00] text-white shadow-xs transition-transform hover:bg-[#386600] active:scale-95"
              aria-label="Search produce"
            >
              <Search className="size-4" />
            </button>
          </form>

          {/* User & Marketplace Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/marketplace"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-[#457D00]"
            >
              <ShoppingBag className="size-4 text-[#457D00]" />
              <span>Marketplace</span>
            </Link>

            {!hasSession && (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-[#457D00] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#386600]"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </PageContainer>
      </div>

      {/* Sub Navigation Bar (Centered clean section links) */}
      <div className="hidden md:block py-2.5">
        <PageContainer className="flex items-center justify-center">
          <nav className="flex items-center gap-7 text-xs font-semibold text-neutral-600">
            {sectionLinks.map((link) =>
              link.isRoute ? (
                <Link key={link.href} href={link.href} className="hover:text-[#457D00] transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className="hover:text-[#457D00] transition-colors">
                  {link.label}
                </a>
              )
            )}
          </nav>
        </PageContainer>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 p-4 md:hidden">
          <form onSubmit={handleSearchSubmit} className="mb-4 flex items-center rounded-lg border border-neutral-200 p-1 pl-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vegetable name..."
              className="w-full text-xs outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
            />
            <button type="submit" className="rounded-md bg-[#457D00] p-2 text-white">
              <Search className="size-3.5" />
            </button>
          </form>
          <div className="flex flex-col gap-2">
            {sectionLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#457D00]"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#457D00]"
                >
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { PageContainer } from "@/src/components/PageContainer";
import { HeaderCategoryDropdown } from "@/src/components/HeaderCategoryDropdown";
import { authClient } from "@/src/lib/auth-client";
import { LandingHeaderMobileDrawer } from "./LandingHeaderMobileDrawer";

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
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = authClient.useSession();
  const hasSession = Boolean(session?.user);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "All Categories") params.set("productType", selectedCategory);
    router.push(`/marketplace?${params.toString()}`);
  };

  return (
    <header
      id="nav-pill"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md ${
        scrolled ? "header-scrolled shadow-md border-[#457D00]/25" : "shadow-xs"
      }`}
    >
      {/* Top Main Bar */}
      <div className="border-b border-neutral-100 py-2.5">
        <PageContainer className="flex items-center justify-between gap-4">
          {/* Brand Logo Lockup: Vector Cart + Parkinsans Typography */}
          <Link href="/" className="group flex shrink-0 items-center gap-1" aria-label="Agrivive home">
            <div className="relative w-[28px] h-[22px] shrink-0 -mr-1 -rotate-[11deg] origin-bottom-left transition-transform duration-200 group-hover:-rotate-[14deg] group-hover:scale-105">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path fill="#457D00" d="M 83 33 C 80 23 74 23 71 27 C 77 29 81 33 82 36 Z" />
                  <path fill="#457D00" d="M 85 32 C 85 21 88 19 91 21 C 90 26 87 30 85 32 Z" />
                  <path fill="#457D00" d="M 87 34 C 93 26 98 28 98 32 C 93 34 89 35 87 36 Z" />
                  <path fill="#457D00" d="M 76 36 Q 85 34 94 37 L 88 74 Q 85 78 82 74 Z" stroke="#ffffff" strokeWidth="2" />
                </g>
                <g>
                  <path stroke="#457D00" d="M 114 27 V 21 M 108 25 L 120 25 M 109 23 L 119 29" strokeWidth="3" strokeLinecap="round" />
                  <circle fill="#457D00" cx="114" cy="45" r="14.5" stroke="#ffffff" strokeWidth="2" />
                </g>
                <g>
                  <path fill="#457D00" d="M 139 48 H 149 L 147 68 H 141 Z" />
                  <circle fill="#457D00" cx="137" cy="37" r="8.5" stroke="#ffffff" strokeWidth="1.5" />
                  <circle fill="#457D00" cx="151" cy="37" r="8.5" stroke="#ffffff" strokeWidth="1.5" />
                  <circle fill="#457D00" cx="144" cy="29" r="9.5" stroke="#ffffff" strokeWidth="1.5" />
                </g>
                <path fill="#457D00" d="M 68 50 H 164 Q 172 50 170 58 L 160 98 Q 158 106 148 106 H 88 Q 80 106 78 98 L 65 58 Q 63 50 68 50 Z" />
                <path stroke="#ffffff" d="M 78 57 H 154 Q 158 57 157 61" strokeWidth="3.5" strokeLinecap="round" />
                <path stroke="#457D00" d="M 32 38 L 46 38 Q 56 38 60 48 L 78 116 Q 81 126 92 126 L 152 126" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                <circle fill="#ffffff" stroke="#457D00" cx="88" cy="138" r="9.5" strokeWidth="6" />
                <circle fill="#ffffff" stroke="#457D00" cx="144" cy="138" r="9.5" strokeWidth="6" />
              </svg>
            </div>
            <span className="font-brand text-[22px] font-extrabold tracking-[-0.035em] text-[#457D00] leading-none">Agrivive</span>
          </Link>

          {/* Integrated Real Search Bar (PioMart Style) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl items-center rounded-full border border-neutral-300 bg-neutral-50/70 p-1 pl-4 transition-all focus-within:border-[#457D00] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#457D00]/20">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vegetable name..."
              className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none font-sans"
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
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-[#457D00] transition-colors"
            >
              <ShoppingBag className="size-4 text-[#457D00]" />
              <span>Marketplace</span>
            </Link>

            {hasSession ? (
              <Link
                href="/buyer/orders"
                className="inline-flex min-h-9 items-center rounded-full bg-[#457D00] px-4 text-xs font-bold text-white transition hover:bg-[#386600]"
              >
                My Passes
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-3 py-1.5 text-xs font-bold text-neutral-700 hover:text-[#457D00] transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-[#E2FD56] px-4 py-1.5 text-xs font-black text-[#111827] shadow-xs transition-all hover:bg-[#d4f244] hover:shadow-md hover:scale-105 active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 md:hidden hover:bg-neutral-100 active:scale-95 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </PageContainer>
      </div>

      {/* Sub Navigation Bar (Clean section links with Live Surplus indicator) */}
      <div className="hidden md:block py-2">
        <PageContainer className="flex items-center justify-center">
          <nav className="flex items-center gap-7 text-xs font-semibold text-neutral-600 font-sans">
            {sectionLinks.map((link) => {
              const isLive = link.href === "#live-inventory";
              const content = isLive ? (
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#008459] animate-pulse" />
                  <span>{link.label}</span>
                </span>
              ) : (
                link.label
              );

              return link.isRoute ? (
                <Link key={link.href} href={link.href} className="hover:text-[#457D00] transition-colors">
                  {content}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className="hover:text-[#457D00] transition-colors">
                  {content}
                </a>
              );
            })}
          </nav>
        </PageContainer>
      </div>

      {/* Mobile Drawer */}
      <LandingHeaderMobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        sectionLinks={sectionLinks}
        hasSession={hasSession}
      />
    </header>
  );
}

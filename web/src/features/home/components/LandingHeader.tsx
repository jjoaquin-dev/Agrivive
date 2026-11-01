"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import { LandingHeaderMobileDrawer } from "./LandingHeaderMobileDrawer";
import { LandingHeaderNav, type LandingSectionLink } from "./LandingHeaderNav";

const sectionLinks: LandingSectionLink[] = [
  { label: "Public Marketplace Overview", href: "/marketplace/overview", isRoute: true, group: "page" },
  { label: "Categories", href: "#categories", group: "section" },
  { label: "Live Surplus", href: "#live-inventory", group: "section" },
  { label: "How It Works", href: "#how-it-works", group: "section" },
  { label: "Why Surplus?", href: "#why-agrivive", group: "section" },
  { label: "FAQ", href: "#faq", group: "section" },
];

export function LandingHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const { data: session } = authClient.useSession();
  const hasSession = Boolean(session?.user);

  // Section anchors only exist on the home page; elsewhere they become links back to it ("/#faq")
  const links = pathname === "/" ? sectionLinks : sectionLinks.map((l) => (l.href.startsWith("#") ? { ...l, href: `/${l.href}`, isRoute: true } : l));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    router.push(`/marketplace?${params.toString()}`);
  };

  const pillSurface = `rounded-full border bg-white/95 backdrop-blur-md transition-[box-shadow,border-color] duration-300 ${
    scrolled ? "header-scrolled border-[#457D00]/25" : "border-neutral-200/80 shadow-sm"
  }`;

  return (
    <header id="nav-pill" className="pointer-events-none fixed inset-x-0 top-3 z-40 px-3 sm:px-6 lg:px-8">
      {/* Page scroll progress */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 h-[3px] bg-[#457D00]/10">
        <div className="h-full origin-left bg-[#457D00]" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* Floating pill: logo, section links and actions */}
      <div className={`${pillSurface} pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-3 py-2 pl-5 pr-6`}>
        {/* Brand Logo Lockup: Vector Cart + Parkinsans Typography */}
        <Link id="header-logo" href="/" className="group flex shrink-0 items-center gap-1" aria-label="Agrivive home">
          <div className="relative w-[28px] h-[22px] shrink-0 -mr-2 -rotate-[11deg] origin-bottom-left transition-transform duration-200 group-hover:-rotate-[14deg] group-hover:scale-105">
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
          <span className="font-heading text-[22px] font-semibold tracking-[-0.035em] text-[#457D00] leading-none">Agrivive</span>
        </Link>

        {/* Section links live inside the main pill */}
        <div id="header-subnav" className="hidden min-w-0 flex-1 justify-center xl:flex">
          <LandingHeaderNav links={links} />
        </div>

        {/* User & Marketplace Action */}
        <div id="header-actions" className="flex items-center gap-3">
          <Link
            href="/marketplace"
            className="hidden sm:inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-neutral-700 hover:text-[#457D00] transition-colors"
          >
            <ShoppingBag className="size-4 text-[#457D00]" />
            <span>Marketplace</span>
          </Link>

          {!hasSession && (
            <div className="flex items-center gap-2">
              <Link href="/login" className="inline-flex min-h-11 items-center whitespace-nowrap px-3 text-sm font-bold text-neutral-700 hover:text-[#457D00] transition-colors">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex min-h-11 items-center rounded-full bg-[#E2FD56] px-4 text-sm font-black text-[#14231A] shadow-sm transition-all hover:bg-[#E2FD56]/90 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 xl:hidden hover:bg-neutral-100 active:scale-95 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="landing-mobile-nav"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <LandingHeaderMobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        sectionLinks={links}
        hasSession={hasSession}
      />
    </header>
  );
}

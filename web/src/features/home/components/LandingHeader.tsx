"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import { HeaderMegaMenu } from "./HeaderMegaMenu";

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
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

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div
        id="nav-pill"
        className={`pointer-events-auto rounded-full bg-white/95 backdrop-blur-md transition-all duration-300 border border-neutral-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 ${
          scrolled ? "shadow-2xl border-[#457D00]/25" : "shadow-lg"
        }`}
      >
        {/* Brand Logo Lockup: Splash Screen Cart + Agrivive (Left) */}
        <Link href="/" className="group flex shrink-0 items-center gap-0" aria-label="Agrivive home">
          <div className="relative w-[32px] h-[26px] shrink-0 -mr-1.5 -rotate-[11deg] origin-bottom-left transition-transform duration-200 group-hover:-rotate-[14deg] group-hover:scale-105">
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

        {/* Centered Navigation Links with Mega-Menu Dropdown */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-neutral-700">
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-[#457D00] py-1 transition-colors group-hover:text-[#457D00] cursor-pointer"
            >
              <span>Browse Produce</span>
              <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <HeaderMegaMenu />
          </div>

          <a href="#live-inventory" className="hover:text-[#457D00] transition-colors flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#008459] animate-pulse" />
            <span>Live Surplus</span>
          </a>
          <a href="#how-it-works" className="hover:text-[#457D00] transition-colors">How It Works</a>
          <a href="#why-agrivive" className="hover:text-[#457D00] transition-colors">Why Agrivive</a>
          <a href="#faq" className="hover:text-[#457D00] transition-colors">FAQ</a>
        </nav>

        {/* Right: Language Selector & CTA Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-bold text-neutral-700">
            <span>🇵🇭</span>
            <span>DVO / EN</span>
          </div>

          {hasSession ? (
            <Link
              href="/buyer/orders"
              className="inline-flex min-h-8 items-center rounded-full bg-[#457D00] px-4 text-xs font-bold text-white transition hover:bg-[#386600]"
            >
              My Passes
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-flex px-3 py-1.5 text-xs font-bold text-neutral-700 hover:text-[#457D00] transition-colors whitespace-nowrap">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="hidden sm:inline-flex rounded-full bg-[#E2FD56] px-4 sm:px-5 py-2 text-xs font-black text-[#111827] shadow-xs transition-all hover:bg-[#d4f244] hover:shadow-md hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Register
              </Link>
            </>
          )}

          <button
            type="button"
            className="md:hidden flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:scale-90 transition-all cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="pointer-events-auto md:hidden mt-2.5 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-neutral-200/90 p-5 space-y-1 transition-all duration-300">
          <a
            href="#categories"
            onClick={() => setMobileOpen(false)}
            className="flex items-center min-h-[48px] px-3.5 rounded-2xl text-sm font-bold text-neutral-800 hover:text-[#457D00] hover:bg-neutral-50 active:scale-98 transition-colors"
          >
            Browse Categories
          </a>
          <a
            href="#live-inventory"
            onClick={() => setMobileOpen(false)}
            className="flex items-center min-h-[48px] px-3.5 rounded-2xl text-sm font-bold text-neutral-800 hover:text-[#457D00] hover:bg-neutral-50 active:scale-98 transition-colors"
          >
            Live Surplus Produce
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="flex items-center min-h-[48px] px-3.5 rounded-2xl text-sm font-bold text-neutral-800 hover:text-[#457D00] hover:bg-neutral-50 active:scale-98 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#why-agrivive"
            onClick={() => setMobileOpen(false)}
            className="flex items-center min-h-[48px] px-3.5 rounded-2xl text-sm font-bold text-neutral-800 hover:text-[#457D00] hover:bg-neutral-50 active:scale-98 transition-colors"
          >
            Why Agrivive
          </a>
          <a
            href="#faq"
            onClick={() => setMobileOpen(false)}
            className="flex items-center min-h-[48px] px-3.5 rounded-2xl text-sm font-bold text-neutral-800 hover:text-[#457D00] hover:bg-neutral-50 active:scale-98 transition-colors"
          >
            FAQ
          </a>

          <div className="pt-4 mt-2 border-t border-neutral-100 flex flex-col gap-2.5">
            {hasSession ? (
              <Link
                href="/buyer/orders"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[48px] items-center justify-center rounded-2xl bg-[#457D00] text-xs font-bold text-white shadow-xs active:scale-98 transition-all"
              >
                My Passes
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[48px] items-center justify-center rounded-2xl bg-[#E2FD56] text-xs font-black text-[#111827] shadow-xs active:scale-98 transition-all"
                >
                  Register Account
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:text-[#457D00] active:scale-98 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

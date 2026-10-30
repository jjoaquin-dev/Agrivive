"use client";

import React from "react";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

interface LandingHeaderMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  sectionLinks: { label: string; href: string; isRoute?: boolean }[];
  hasSession: boolean;
}

export function LandingHeaderMobileDrawer({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  sectionLinks,
  hasSession,
}: LandingHeaderMobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      id="landing-mobile-nav"
      data-lenis-prevent
      className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-neutral-200 p-4 md:hidden bg-white/95 backdrop-blur-md"
    >
      <form onSubmit={onSearchSubmit} className="mb-4 flex items-center rounded-full border border-neutral-200 bg-neutral-50 p-1 pl-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vegetable name..."
          className="w-full text-sm bg-transparent outline-none border-none shadow-none font-sans"
        />
        <button type="submit" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#457D00] text-white" aria-label="Search">
          <Search className="size-4" />
        </button>
      </form>
      <div className="flex flex-col gap-1">
        {sectionLinks.map((link) =>
          link.isRoute ? (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center min-h-[44px] px-2 text-sm font-semibold text-neutral-700 hover:text-[#457D00] rounded-xl hover:bg-neutral-50 transition-colors"
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center min-h-[44px] px-2 text-sm font-semibold text-neutral-700 hover:text-[#457D00] rounded-xl hover:bg-neutral-50 transition-colors"
            >
              {link.label}
            </a>
          )
        )}
        <div className="pt-3 mt-2 border-t border-neutral-100 flex flex-col gap-2">
          <Link
            href="/marketplace"
            onClick={onClose}
            className="flex items-center gap-1.5 min-h-[44px] px-2 text-sm font-bold text-neutral-800"
          >
            <ShoppingBag className="size-4 text-[#457D00]" />
            <span>Browse Marketplace</span>
          </Link>
          {!hasSession && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/login"
                onClick={onClose}
                className="flex min-h-[44px] items-center justify-center rounded-full border border-neutral-200 text-sm font-bold text-neutral-700"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="flex min-h-[44px] items-center justify-center rounded-full bg-[#E2FD56] text-sm font-black text-[#111827]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

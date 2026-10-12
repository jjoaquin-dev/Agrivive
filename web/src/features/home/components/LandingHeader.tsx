"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Store, X } from "lucide-react";
import { PageContainer } from "@/src/components/PageContainer";

const navLinks = [
  { label: "Benefits", href: "#benefits" },
  { label: "Why Agrivive", href: "#why-agrivive" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Market Pulse", href: "#market-pulse" },
  { label: "For Sellers", href: "#sellers" },
];

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-agrivive-border/80 bg-white/95 shadow-[0_1px_0_rgba(31,77,58,0.03)] backdrop-blur">
      <PageContainer className="flex min-h-[68px] items-center justify-between gap-5">
        {/* Left: Standalone Transparent Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="Agrivive home">
          <Image
            src="/brand/agrivive-logo-icon.png"
            alt="Agrivive"
            width={40}
            height={40}
            className="size-10 object-contain"
            priority
          />
        </Link>

        {/* Center: Landing Page Section Anchor Navigation */}
        <nav className="hidden items-center gap-1 text-sm font-semibold md:flex" aria-label="Landing page sections">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-3.5 py-2 text-agrivive-muted transition-colors hover:bg-agrivive-background hover:text-agrivive-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Direct Marketplace & Sign In */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl px-3.5 py-2 text-sm font-semibold text-agrivive-primary hover:bg-agrivive-background"
          >
            Sign in
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-agrivive-primary px-4 text-sm font-semibold text-white shadow-xs transition-[background-color,transform] hover:bg-agrivive-primaryPressed"
          >
            <Store className="size-4" />
            Marketplace
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-agrivive-border text-agrivive-primary md:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </PageContainer>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav className="border-t border-agrivive-border py-4 md:hidden" aria-label="Mobile section navigation">
          <PageContainer className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 font-semibold text-agrivive-text hover:bg-agrivive-background"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-agrivive-border pt-3">
              <Link
                href="/marketplace"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-agrivive-primary px-4 font-semibold text-white"
              >
                <Store className="size-4" /> Browse marketplace
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-agrivive-border px-4 font-semibold text-agrivive-primary"
              >
                Sign in
              </Link>
            </div>
          </PageContainer>
        </nav>
      )}
    </header>
  );
}

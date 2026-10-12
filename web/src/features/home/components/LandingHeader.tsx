"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { PageContainer } from "@/src/components/PageContainer";

const navLinks = [
  { label: "Marketplace", href: "/marketplace" },
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
        {/* Left: Brand Lockup */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Agrivive home">
          <div className="flex size-10 items-center justify-center rounded-xl bg-agrivive-primary/5 p-1 transition-transform group-hover:scale-105">
            <Image
              src="/brand/agrivive-logo-icon.png"
              alt="Agrivive"
              width={36}
              height={36}
              className="size-8 object-contain"
              priority
            />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-agrivive-primary">
            Agrivive
          </span>
        </Link>

        {/* Center: Landing Page Navigation Links */}
        <nav className="hidden items-center gap-1 text-sm font-semibold md:flex" aria-label="Landing page navigation">
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

        {/* Right Actions: Sign in & Register Button */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl px-3.5 py-2 text-sm font-semibold text-agrivive-muted hover:bg-agrivive-background hover:text-agrivive-primary"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex min-h-10 items-center rounded-xl bg-agrivive-primary px-5 text-sm font-semibold text-white shadow-xs transition-[background-color,transform] hover:bg-agrivive-primaryPressed active:scale-[0.98]"
          >
            Register
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
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-agrivive-primary px-4 font-semibold text-white"
              >
                Register
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

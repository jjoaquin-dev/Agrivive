"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, Heart, MapPin } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="relative overflow-hidden bg-agrivive-primary text-white">
      {/* Top Grid: Brand & Categorized Navigation Links */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/agrivive-logo-icon.png"
                alt="Agrivive"
                width={40}
                height={40}
                className="size-10 object-contain brightness-0 invert"
              />
              <span className="font-heading text-xl font-bold tracking-[0.14em] text-white">
                AGRIVIVE
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-50/70">
              Connecting local Davao City market vendors with conscious buyers to reduce surplus waste and celebrate fresh harvest.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#F2DFAF]">
              <MapPin className="size-3.5" />
              <span>Bankerohan, Agdao &amp; Toril Public Markets</span>
            </div>
          </div>

          {/* Links Column 1: Marketplace */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#F2DFAF]">Marketplace</p>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-50/80">
              <li><Link href="/marketplace" className="hover:text-white">All Listings</Link></li>
              <li><Link href="/marketplace?productType=Leafy+Greens" className="hover:text-white">Leafy Greens</Link></li>
              <li><Link href="/marketplace?productType=Fruit+Vegetables" className="hover:text-white">Fruit Veggies</Link></li>
              <li><Link href="/marketplace?productType=Root+Vegetables" className="hover:text-white">Root Crops</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Platform */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#F2DFAF]">Platform</p>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-50/80">
              <li><a href="#benefits" className="hover:text-white">Buyer Benefits</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><a href="#market-pulse" className="hover:text-white">Market Pulse Trends</a></li>
              <li><a href="#sellers" className="hover:text-white">For Local Sellers</a></li>
            </ul>
          </div>

          {/* Links Column 3: Access */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#F2DFAF]">Get Started</p>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-50/80">
              <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-white">Create Account</Link></li>
              <li><Link href="/marketplace" className="inline-flex items-center gap-1 text-[#F2DFAF] hover:underline">Market Map <ArrowUpRight className="size-3.5" /></Link></li>
              <li>
                <a
                  href="/downloads/agrivive-seller.apk"
                  download="agrivive-seller.apk"
                  className="inline-flex items-center gap-1.5 font-medium text-white hover:text-[#F2DFAF]"
                >
                  Download Seller App (APK) <ArrowDownToLine className="size-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mascot Centerpiece: Cute Veggies Climbing AGRIVIVE */}
        <div className="relative mt-14 overflow-hidden rounded-[28px] border border-white/10 bg-black/20 p-2 sm:mt-16 sm:p-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px]">
            <Image
              src="/brand/cute-veggies-footer.jpg"
              alt="Cute 3D vegetables climbing and playing on giant AGRIVIVE letters"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1280px) 1200px, 100vw"
            />
          </div>
        </div>

        {/* Giant Laravel-style Typography Watermark */}
        <div className="mt-6 select-none overflow-hidden text-center" aria-hidden="true">
          <p className="font-heading text-[13vw] font-black leading-none tracking-[-0.04em] text-white/[0.08]">
            AGRIVIVE
          </p>
        </div>

        {/* Bottom Sub-bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-emerald-50/60 sm:flex-row">
            <p>© 2026 Agrivive. Fresh produce rescued from Davao City local markets.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="size-3 text-agrivive-terracotta" /> for local market communities
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

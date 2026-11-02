import Image from "next/image";
import { SELLER_APK_URL } from "@/src/lib/appDownload";
import { LegalLinks } from "@/src/features/legal/components/LegalLinks";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, Heart, MapPin } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="relative overflow-hidden bg-agrivive-primary font-heading text-white">
      {/* Top Grid: Brand & Categorized Navigation Links */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {/* Brand info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Image
              src="/brand/agrivive-logo-full-white.png"
              alt="Agrivive"
              width={778}
              height={215}
              className="h-10 w-auto"
            />
            <p className="mt-5 max-w-sm text-[15px] leading-7 text-emerald-50/75">
              Connecting local Davao City market vendors and smallholder farms with conscious buyers to reduce surplus waste and celebrate fresh harvest.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#FCEC9A]">
              <MapPin className="size-3.5" />
              <span>Davao City Farms &amp; Public Market Stalls</span>
            </div>
          </div>

          {/* Links Column 1: Produce Categories */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#FCEC9A]">Categories</p>
            <ul className="mt-5 space-y-3 text-[15px] text-emerald-50/80">
              <li><Link href="/marketplace?productType=Leafy+Greens" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Leafy Greens</Link></li>
              <li><Link href="/marketplace?productType=Fruit+Vegetables" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Fruit Vegetables</Link></li>
              <li><Link href="/marketplace?productType=Root+Vegetables" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Root Vegetables</Link></li>
              <li><Link href="/marketplace?productType=Pod+Vegetables" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Pod Vegetables</Link></li>
              <li><Link href="/marketplace?productType=Tuber+Vegetables" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Tuber Vegetables</Link></li>
              <li><Link href="/marketplace?productType=Bulb+Vegetables" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Bulb Vegetables</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Sections (Matching Navbar) */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#FCEC9A]">Explore</p>
            <ul className="mt-5 space-y-3 text-[15px] text-emerald-50/80">
              <li><a href="#categories" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Categories</a></li>
              <li><a href="#live-inventory" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Live Surplus</a></li>
              <li><a href="#how-it-works" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">How It Works</a></li>
              <li><a href="#why-agrivive" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Why Surplus?</a></li>
              <li><a href="#faq" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">FAQ</a></li>
            </ul>
          </div>

          {/* Links Column 3: Access */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#FCEC9A]">Get Started</p>
            <ul className="mt-5 space-y-3 text-[15px] text-emerald-50/80">
              <li><Link href="/login" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Sign In</Link></li>
              <li><Link href="/signup" className="rounded-lg transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCEC9A]">Create Account</Link></li>
              <li><Link href="/marketplace" className="inline-flex items-center gap-1 text-[#FCEC9A] hover:underline">Market Map <ArrowUpRight className="size-3.5" /></Link></li>
              <li>
                <a
                  href={SELLER_APK_URL}
                  download="agrivive-seller.apk"
                  className="inline-flex items-center gap-1.5 font-medium text-white hover:text-[#FCEC9A]"
                >
                  Download Seller App (APK) <ArrowDownToLine className="size-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Typography Watermark */}
        <div className="mt-6 select-none overflow-hidden text-center" aria-hidden="true">
          <p className="font-heading text-[13vw] font-bold leading-none tracking-[-0.04em] text-white/[0.08]">
            AGRIVIVE
          </p>
        </div>

        {/* Bottom Sub-bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-emerald-50/75 sm:flex-row">
            <p>© 2026 Agrivive. Fresh produce rescued from Davao City farms and local markets.</p>
            <LegalLinks />
            <p className="flex items-center gap-1">
              Made with <Heart className="size-3 text-agrivive-terracotta" /> for local grower communities
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

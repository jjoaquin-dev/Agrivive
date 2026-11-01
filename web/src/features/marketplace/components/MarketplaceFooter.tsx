import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, Heart, MapPin } from "lucide-react";

export function MarketplaceFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-agrivive-primary font-heading text-white">
      {/* Top Grid: Brand & Categorized Navigation Links */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1.5">
              <Image
                src="/brand/agrivive-logo-full-white.png"
                alt="Agrivive"
                width={137}
                height={38}
                className="h-[38px] w-auto object-contain"
              />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-50/70">
              Browse and reserve surplus produce directly from verified Davao City market stalls and local farms at fair prices before the day ends.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#FCEC9A]">
              <MapPin className="size-3.5" />
              <span>Bankerohan, Agdao, Mintal &amp; Calinan Public Markets</span>
            </div>
          </div>

          {/* Links Column 1: Produce Categories */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#FCEC9A]">
              Produce
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-50/80">
              <li>
                <Link href="/marketplace?productType=Leafy+Greens" className="hover:text-white transition-colors">
                  Leafy Greens
                </Link>
              </li>
              <li>
                <Link href="/marketplace?productType=Fruit+Vegetables" className="hover:text-white transition-colors">
                  Fruit Vegetables
                </Link>
              </li>
              <li>
                <Link href="/marketplace?productType=Root+Vegetables" className="hover:text-white transition-colors">
                  Root Vegetables
                </Link>
              </li>
              <li>
                <Link href="/marketplace?productType=Pod+Vegetables" className="hover:text-white transition-colors">
                  Pod Vegetables
                </Link>
              </li>
              <li>
                <Link href="/marketplace?productType=Tuber+Vegetables" className="hover:text-white transition-colors">
                  Tuber Vegetables
                </Link>
              </li>
              <li>
                <Link href="/marketplace?productType=Flower+Vegetables" className="hover:text-white transition-colors">
                  Flower Vegetables
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Marketplace Navigation */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#FCEC9A]">
              Marketplace
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-50/80">
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors">
                  All Surplus Lots
                </Link>
              </li>
              <li>
                <Link href="/marketplace/overview" className="hover:text-white transition-colors">
                  Public Overview
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Shopper & Vendor Resources */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#FCEC9A]">
              Community
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-50/80">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/" className="inline-flex items-center gap-1 text-[#FCEC9A] hover:underline">
                  Home Page <ArrowUpRight className="size-3.5" />
                </Link>
              </li>
              <li>
                <a
                  href="/downloads/agrivive-seller.apk"
                  download="agrivive-seller.apk"
                  className="inline-flex items-center gap-1.5 font-medium text-white hover:text-[#FCEC9A]"
                >
                  Download Seller App <ArrowDownToLine className="size-3.5" />
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
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-emerald-50/60 sm:flex-row">
            <p>© 2026 Agrivive Marketplace. Fresh surplus vegetables rescued across Davao City.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="size-3 text-agrivive-terracotta" /> for local market vendors &amp; shoppers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

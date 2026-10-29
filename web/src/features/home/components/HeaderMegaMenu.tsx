"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeaderMegaMenu() {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[740px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 pointer-events-auto">
      <div className="rounded-3xl bg-white shadow-2xl border border-neutral-200/80 p-6 grid grid-cols-12 gap-6 text-left">
        {/* Left: 4 Category Chips */}
        <div className="col-span-7">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008459]">Produce Categories</span>
            <Link href="/marketplace" className="text-[11px] font-bold text-neutral-500 hover:text-[#457D00] flex items-center gap-1">
              All Surplus <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-3.5">
            <a href="#categories" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#FAF9F5] transition-colors group/item">
              <div className="size-9 rounded-xl bg-[#EAF7E1] flex items-center justify-center shrink-0">
                <Image src="/categories/leafy-greens.png" alt="Leafy Greens" width={24} height={24} className="size-6 object-contain" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900 group-hover/item:text-[#457D00]">Leafy Greens</div>
                <div className="text-[10px] text-neutral-500">Bok choy, lettuce</div>
              </div>
            </a>

            <a href="#categories" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#FAF9F5] transition-colors group/item">
              <div className="size-9 rounded-xl bg-[#FEECE0] flex items-center justify-center shrink-0">
                <Image src="/categories/fruit-vegetables.png" alt="Fruit Veggies" width={24} height={24} className="size-6 object-contain" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900 group-hover/item:text-[#457D00]">Fruit Veggies</div>
                <div className="text-[10px] text-neutral-500">Tomatoes, eggplant</div>
              </div>
            </a>

            <a href="#categories" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#FAF9F5] transition-colors group/item">
              <div className="size-9 rounded-xl bg-[#FEF0D8] flex items-center justify-center shrink-0">
                <Image src="/categories/root-vegetables.png" alt="Root Crops" width={24} height={24} className="size-6 object-contain" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900 group-hover/item:text-[#457D00]">Root Crops</div>
                <div className="text-[10px] text-neutral-500">Carrots, radish</div>
              </div>
            </a>

            <a href="#categories" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#FAF9F5] transition-colors group/item">
              <div className="size-9 rounded-xl bg-[#E7F8DC] flex items-center justify-center shrink-0">
                <Image src="/categories/pod-vegetables.png" alt="Pod Veggies" width={24} height={24} className="size-6 object-contain" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900 group-hover/item:text-[#457D00]">Pod Veggies</div>
                <div className="text-[10px] text-neutral-500">Okra, string beans</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right: Featured Editorial Card */}
        <div className="col-span-5 bg-[#FAF9F5] rounded-2xl p-4 flex flex-col justify-between border border-neutral-200/60">
          <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3">
            <Image src="/brand/agrivive-market-day-hero.png" alt="Davao Market Stall" fill className="object-cover" />
            <span className="absolute top-2 left-2 rounded-md bg-[#457D00] text-[#E2FD56] text-[10px] font-black px-2 py-0.5">
              Live Today
            </span>
          </div>
          <div>
            <h4 className="font-heading text-xs font-bold text-neutral-900">Bankerohan Public Market</h4>
            <p className="text-[11px] text-neutral-500 mt-1">14 verified stalls currently have fresh surplus available for 24-hr reservation.</p>
          </div>
          <a href="#live-inventory" className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#457D00] text-white py-2 px-3 text-xs font-bold hover:bg-[#008459] transition-colors">
            <span>View Live Stalls</span>
            <ArrowRight className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

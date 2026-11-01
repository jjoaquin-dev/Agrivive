"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrollLift } from "@/src/hooks/useScrollLift";

const categories = [
  {
    name: "Leafy Greens",
    href: "/marketplace?productType=Leafy+Greens",
    image: "/categories/leafy-greens.png",
    alt: "Fresh leafy greens including bok choy, lettuce, and water spinach",
    topGradient: "from-[#EAF7E1]/90 via-[#F4FBEF]/40 to-transparent",
    hoverBorder: "hover:border-[#CFECC0]",
  },
  {
    name: "Fruit Vegetables",
    href: "/marketplace?productType=Fruit+Vegetables",
    image: "/categories/card/fruit-vegetables.png",
    imageScale: "scale-[1.1]",
    alt: "Fresh fruit vegetables including tomatoes, eggplant, and squash",
    topGradient: "from-[#FEECE0]/90 via-[#FEF6F0]/40 to-transparent",
    hoverBorder: "hover:border-[#F7CDB5]",
  },
  {
    name: "Root Vegetables",
    href: "/marketplace?productType=Root+Vegetables",
    image: "/categories/card/root-vegetables.png",
    imageScale: "scale-[1.12]",
    alt: "Fresh root vegetables including carrots, radish, and beetroot",
    topGradient: "from-[#FEF0D8]/90 via-[#FFF8EC]/40 to-transparent",
    hoverBorder: "hover:border-[#F8D8B0]",
  },
  {
    name: "Pod Vegetables",
    href: "/marketplace?productType=Pod+Vegetables",
    image: "/categories/pod-vegetables.png",
    alt: "Fresh pod vegetables including okra, string beans, and snap peas",
    topGradient: "from-[#E7F8DC]/90 via-[#F3FCEF]/40 to-transparent",
    hoverBorder: "hover:border-[#C5E8B2]",
  },
  {
    name: "Tuber Vegetables",
    href: "/marketplace?productType=Tuber+Vegetables",
    image: "/categories/card/tuber-vegetables.png",
    imageScale: "scale-[0.85]",
    alt: "Fresh tuber vegetables including potatoes, ube yam, and taro",
    topGradient: "from-[#F2EBFE]/90 via-[#F9F5FF]/40 to-transparent",
    hoverBorder: "hover:border-[#DDCFF5]",
  },
  {
    name: "Bulb Vegetables",
    href: "/marketplace?productType=Bulb+Vegetables",
    image: "/categories/bulb-vegetables.png",
    alt: "Fresh bulb vegetables including onions, garlic, and scallions",
    topGradient: "from-[#FEF4DC]/90 via-[#FFF9EC]/40 to-transparent",
    hoverBorder: "hover:border-[#F6DCB2]",
  },
];

export function HomeCategories() {
  const gridRef = useRef<HTMLUListElement>(null);
  useScrollLift(gridRef, ".category-lift");

  return (
    <section id="categories" className="bg-[#FAF9F5] py-16 sm:py-24 border-y border-neutral-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial split header: heading left, supporting line right on desktop */}
        <div data-reveal className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2 className="type-section font-heading text-neutral-900">Our Popular Categories</h2>
          <p className="type-lede max-w-md text-neutral-600 lg:text-right">
            Browse rescued surplus harvest by category directly from Davao partner farms and public stalls.
          </p>
        </div>

        {/* 2 / 3 / 6 columns: every category stays visible, no sideways scrolling on phones */}
        <ul ref={gridRef} className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <li key={cat.name} data-reveal="pop">
              {/* Three layers, no clashes: li = reveal, this wrapper = scroll lift, Link = hover lift */}
              <div className="category-lift">
              <Link
                href={cat.href}
                className={`group relative flex aspect-[4/5] flex-col items-center justify-between overflow-hidden rounded-2xl border border-neutral-200/70 bg-[#F4F7EE] p-4 transition-[transform,border-color,box-shadow] duration-200 ease-settle hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F5] ${cat.hoverBorder}`}
              >
                {/* Soft wash behind the produce */}
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b ${cat.topGradient}`} />

                <div className={`relative z-10 w-full flex-1 ${cat.imageScale ?? ""}`}>
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="(min-width: 1024px) 170px, (min-width: 640px) 30vw, 45vw"
                    className="object-contain p-1 drop-shadow-sm transition-transform duration-500 ease-settle group-hover:scale-105"
                  />
                </div>

                <span className="relative z-10 mt-2 text-center font-heading text-sm font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-[#457D00] sm:text-[15px]">
                  {cat.name}
                </span>
              </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

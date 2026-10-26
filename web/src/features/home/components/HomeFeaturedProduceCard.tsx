"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Heart, MapPin, Minus, Plus, ShoppingCart } from "lucide-react";

export type FeaturedProduceItem = {
  id: string;
  name: string;
  category: string;
  originalPrice: string;
  surplusPrice: string;
  unit: "kilo" | "pile" | "sack";
  quantity: string;
  discount: string;
  stall: string;
  image: string;
};

export function HomeFeaturedProduceCard({ item }: { item: FeaturedProduceItem }) {
  const [isFav, setIsFav] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const [inCart, setInCart] = useState(0);

  function handleAdd() {
    setInCart((prev) => prev + selectedQty);
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-neutral-200/70 bg-white p-3.5 shadow-[0_4px_20px_-2px_rgba(20,40,25,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-6px_rgba(20,60,35,0.12)]">
      <div>
        {/* Seamless Image Container (No grey borders, perfectly fitted) */}
        <div className="relative h-48 w-full overflow-hidden rounded-[18px] bg-white p-1">
          <Link
            href="/marketplace"
            className="relative flex h-full w-full items-center justify-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Top-Left: Golden Amber Discount Badge */}
          <div className="pointer-events-none absolute left-3 top-3 z-10">
            <span className="inline-flex items-center rounded-full bg-[#FEA938] px-2.5 py-0.5 text-[11px] font-bold text-neutral-950 shadow-2xs">
              {item.discount}
            </span>
          </div>

          {/* Top-Right: Clean Wishlist Heart */}
          <button
            type="button"
            onClick={() => setIsFav((prev) => !prev)}
            aria-label={isFav ? "Remove from saved items" : "Save item"}
            className={`absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full border shadow-2xs backdrop-blur-md transition active:scale-95 ${
              isFav
                ? "border-red-400 bg-red-500 text-white"
                : "border-neutral-200/80 bg-white/90 text-neutral-600 hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart
              className={`size-4 ${isFav ? "fill-white" : "fill-transparent"}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Identity & Metadata Zone */}
        <div className="flex flex-col gap-2 pt-3">
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-semibold text-neutral-700">
              {item.category}
            </span>
            <div className="flex items-center gap-1 text-neutral-500 truncate max-w-[130px]">
              <MapPin className="size-3 shrink-0 text-[#457D00]" />
              <span className="truncate">{item.stall}</span>
            </div>
          </div>

          <h3 className="line-clamp-1 font-heading text-[15px] font-bold text-neutral-900 leading-snug group-hover:text-[#457D00] transition-colors">
            <Link href="/marketplace">
              {item.name}
            </Link>
          </h3>

          {/* Price & Stock (Dot Removed) */}
          <div className="flex items-baseline justify-between pt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-xl font-bold text-[#457D00]">
                {item.surplusPrice}
              </span>
              <del className="text-xs font-medium text-neutral-400">
                {item.originalPrice}
              </del>
              <span className="text-xs text-neutral-500 font-semibold">
                / {item.unit}
              </span>
            </div>

            <span className="text-xs font-semibold text-neutral-500">
              {item.quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Action Zone: Quantity Selector + Cart Icon in CTA */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2">
        <div className="flex h-10 items-center rounded-full border border-neutral-200/80 bg-neutral-100/80 p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
            disabled={selectedQty <= 1}
            aria-label="Decrease quantity"
            className="flex size-7 items-center justify-center rounded-full bg-white text-neutral-700 shadow-2xs transition active:scale-90 hover:bg-neutral-50 disabled:opacity-30"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-7 text-center text-xs font-bold text-neutral-900">
            {selectedQty}
          </span>
          <button
            type="button"
            onClick={() => setSelectedQty((prev) => prev + 1)}
            aria-label="Increase quantity"
            className="flex size-7 items-center justify-center rounded-full bg-white text-neutral-700 shadow-2xs transition active:scale-90 hover:bg-neutral-50"
          >
            <Plus className="size-3" />
          </button>
        </div>

        {/* CTA with ShoppingCart Icon */}
        <button
          type="button"
          onClick={handleAdd}
          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#B8EB5E] hover:bg-[#A8DF4E] px-4 text-xs font-bold text-[#14422B] shadow-2xs transition-all active:scale-95"
        >
          {inCart > 0 ? (
            <>
              <Check className="size-3.5 stroke-[3]" />
              <span>{inCart} in cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="size-3.5 stroke-[2.5]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

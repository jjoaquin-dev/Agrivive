"use client";

import { useEffect, useId, useRef, useState } from "react";

interface MarketplacePriceSliderProps {
  minPrice: string;
  maxPrice: string;
  onChange: (key: "minPrice" | "maxPrice", value: string) => void;
  minLimit?: number;
  maxLimit?: number;
}

const ticks = [0, 200, 400, 600, 800, 1000];

export function MarketplacePriceSlider({
  minPrice,
  maxPrice,
  onChange,
  minLimit = 0,
  maxLimit = 1000,
}: MarketplacePriceSliderProps) {
  const minSliderId = useId();
  const maxSliderId = useId();

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalMin(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  function triggerChange(key: "minPrice" | "maxPrice", value: string) {
    if (key === "minPrice") setLocalMin(value);
    else setLocalMax(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(key, value);
    }, 300);
  }

  const currentMin = localMin !== "" ? Math.max(minLimit, Math.min(Number(localMin), maxLimit)) : minLimit;
  const currentMax = localMax !== "" ? Math.max(minLimit, Math.min(Number(localMax), maxLimit)) : maxLimit;

  const leftPercent = ((currentMin - minLimit) / (maxLimit - minLimit)) * 100;
  const rightPercent = ((currentMax - minLimit) / (maxLimit - minLimit)) * 100;

  return (
    <div className="space-y-2.5">
      {/* Dual-Thumb Slider */}
      <div className="relative flex h-7 items-center">
        {/* Inactive Track */}
        <div className="h-2 w-full rounded-full bg-neutral-200/80" />

        {/* Active Track matching system palette green #457d00 */}
        <div
          className="absolute h-2 rounded-full bg-[#457d00] transition-[left,width] duration-75"
          style={{
            left: `${leftPercent}%`,
            width: `${Math.max(0, rightPercent - leftPercent)}%`,
          }}
        />

        {/* Min Thumb Slider (Palette Orange #fea938) */}
        <input
          id={minSliderId}
          type="range"
          min={minLimit}
          max={maxLimit}
          step={10}
          value={currentMin}
          aria-label="Minimum price"
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), currentMax);
            triggerChange("minPrice", val === minLimit ? "" : String(val));
          }}
          className="pointer-events-none absolute inset-0 z-20 w-full appearance-none bg-transparent 
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-[#fea938] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:transition-transform
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-[#fea938] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white 
            [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Max Thumb Slider (Palette Orange #fea938) */}
        <input
          id={maxSliderId}
          type="range"
          min={minLimit}
          max={maxLimit}
          step={10}
          value={currentMax}
          aria-label="Maximum price"
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), currentMin);
            triggerChange("maxPrice", val === maxLimit ? "" : String(val));
          }}
          className="pointer-events-none absolute inset-0 z-20 w-full appearance-none bg-transparent 
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-[#fea938] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:transition-transform
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-[#fea938] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white 
            [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      {/* Tick Marks */}
      <div className="flex justify-between px-0.5 text-[10px] font-semibold text-neutral-400 select-none">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>

      {/* Min and Max Text Boxes */}
      <div className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
            ₱
          </span>
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            step={10}
            placeholder="0"
            value={localMin}
            onChange={(e) => triggerChange("minPrice", e.target.value)}
            aria-label="Minimum price"
            className="h-10 w-full rounded-xl border border-neutral-200/70 bg-white pl-7 pr-2.5 text-xs font-semibold text-[#14231A] placeholder:text-neutral-500 transition-colors focus:border-[#457d00] focus:outline-none focus:ring-1 focus:ring-[#457d00]"
          />
        </div>
        <span className="select-none text-sm font-bold text-neutral-400">-</span>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
            ₱
          </span>
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            step={10}
            placeholder="1000"
            value={localMax}
            onChange={(e) => triggerChange("maxPrice", e.target.value)}
            aria-label="Maximum price"
            className="h-10 w-full rounded-xl border border-neutral-200/70 bg-white pl-7 pr-2.5 text-xs font-semibold text-[#14231A] placeholder:text-neutral-500 transition-colors focus:border-[#457d00] focus:outline-none focus:ring-1 focus:ring-[#457d00]"
          />
        </div>
      </div>
    </div>
  );
}

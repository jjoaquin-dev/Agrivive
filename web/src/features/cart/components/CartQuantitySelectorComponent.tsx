"use client";

import { Minus, Plus } from "lucide-react";

export type CartQuantitySelectorComponentProps = {
  quantity: number;
  maxQuantity: number;
  productName: string;
  onDecrease: () => void;
  onIncrease: () => void;
};

export const CartQuantitySelectorComponent = ({
  quantity,
  maxQuantity,
  productName,
  onDecrease,
  onIncrease,
}: CartQuantitySelectorComponentProps) => {
  const isMin = quantity <= 1;
  const isMax = Number.isFinite(maxQuantity) && quantity >= maxQuantity;

  return (
    <div
      role="group"
      aria-label={`Quantity selector for ${productName}`}
      className="inline-flex h-9 items-center justify-between rounded-[12px] border border-neutral-300 bg-white px-1 shadow-2xs w-[92px]"
    >
      <button
        type="button"
        disabled={isMin}
        onClick={onDecrease}
        aria-label={`Decrease quantity for ${productName}`}
        className="flex size-6 items-center justify-center rounded-md text-neutral-600 transition hover:bg-neutral-100 active:scale-95 disabled:pointer-events-none disabled:opacity-25 cursor-pointer"
      >
        <Minus className="size-3" aria-hidden="true" />
      </button>

      <span
        className="min-w-6 text-center font-heading text-xs sm:text-sm font-semibold text-[#14231A] select-none tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>

      <button
        type="button"
        disabled={isMax}
        onClick={onIncrease}
        aria-label={`Increase quantity for ${productName}`}
        className="flex size-6 items-center justify-center rounded-md text-neutral-600 transition hover:bg-neutral-100 active:scale-95 disabled:pointer-events-none disabled:opacity-25 cursor-pointer"
      >
        <Plus className="size-3" aria-hidden="true" />
      </button>
    </div>
  );
};

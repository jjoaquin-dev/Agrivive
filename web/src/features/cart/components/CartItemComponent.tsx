"use client";

import Link from "next/link";
import { ProductImage } from "@/src/features/marketplace/components/ProductImage";
import type { CartItem } from "../types";
import { CartQuantitySelectorComponent } from "./CartQuantitySelectorComponent";
import { CartRemoveButtonComponent } from "./CartRemoveButtonComponent";
import { formatPeso as money } from "@/src/lib/money";

export type CartItemComponentProps = {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  onNavigate?: () => void;
};

export const CartItemComponent = ({
  item,
  onUpdateQuantity,
  onRemove,
  onNavigate,
}: CartItemComponentProps) => {
  return (
    <div className="relative flex items-center gap-3.5 sm:gap-4 rounded-2xl border border-neutral-200/90 bg-white p-3.5 sm:p-4 shadow-sm">
      {/* Product Thumbnail */}
      <Link
        href={`/marketplace/${item.id}`}
        onClick={onNavigate}
        className="relative size-[76px] sm:size-[80px] shrink-0 overflow-hidden rounded-xl bg-[#f8f6f1] transition-opacity hover:opacity-95"
        aria-label={`View details for ${item.productName}`}
      >
        <ProductImage
          src={item.imageUrl}
          alt={item.productName}
          category={item.productType}
          className="!object-cover size-full"
        />
      </Link>

      {/* Product Details */}
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <Link
          href={`/marketplace/${item.id}`}
          onClick={onNavigate}
          className="block truncate font-heading text-base sm:text-lg font-bold text-[#14231A] transition-colors hover:text-[#457D00]"
          title={item.productName}
        >
          {item.productName}
        </Link>
        <p className="mt-0.5 text-xs text-neutral-500 font-normal">
          1 {item.scalingType}
        </p>
        <div className="mt-1 flex items-baseline gap-1 text-xs">
          <span className="font-heading text-sm sm:text-base font-bold text-[#225828]">
            {money(Number(item.productPrice))}
          </span>
          <span className="font-body text-neutral-500 font-normal">
            / {item.scalingType}
          </span>
        </div>
      </div>

      {/* Right Column: Delete at Top, Stepper at Bottom */}
      <div className="flex flex-col justify-between items-end self-stretch py-0.5 shrink-0">
        <CartRemoveButtonComponent
          productName={item.productName}
          onRemove={onRemove}
        />
        <CartQuantitySelectorComponent
          quantity={item.quantity}
          maxQuantity={Number(item.productQty)}
          productName={item.productName}
          onDecrease={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
          onIncrease={() => onUpdateQuantity(item.quantity + 1)}
        />
      </div>
    </div>
  );
};

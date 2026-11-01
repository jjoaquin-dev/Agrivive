"use client";

import { Store } from "lucide-react";

export type CartSellerHeaderComponentProps = {
  shopName: string;
};

export const CartSellerHeaderComponent = ({
  shopName,
}: CartSellerHeaderComponentProps) => {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1">
      <span className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-[#EAF5E1] text-[#225828] shrink-0">
        <Store className="size-4" aria-hidden="true" />
      </span>
      <span className="font-heading text-sm sm:text-base font-bold text-[#14231A] tracking-tight truncate">
        {shopName}
      </span>
    </div>
  );
};

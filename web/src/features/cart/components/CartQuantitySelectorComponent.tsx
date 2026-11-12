"use client";

import { QuantityStepper } from "@/src/components/QuantityStepper";

export type CartQuantitySelectorComponentProps = {
  quantity: number;
  maxQuantity: number;
  productName: string;
  onChange: (quantity: number) => void;
};

export const CartQuantitySelectorComponent = ({ quantity, maxQuantity, productName, onChange }: CartQuantitySelectorComponentProps) => (
  <QuantityStepper
    value={quantity}
    max={maxQuantity}
    label={`${productName} quantity`}
    onChange={onChange}
    className="h-11 w-[148px] rounded-xl border border-neutral-300 bg-white px-1 shadow-sm"
    buttonClassName="size-11 rounded-lg"
  />
);

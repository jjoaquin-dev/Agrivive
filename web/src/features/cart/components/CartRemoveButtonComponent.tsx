"use client";

import { Trash2 } from "lucide-react";

export type CartRemoveButtonComponentProps = {
  productName: string;
  onRemove: () => void;
};

export const CartRemoveButtonComponent = ({
  productName,
  onRemove,
}: CartRemoveButtonComponentProps) => {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${productName} from cart`}
      title={`Remove ${productName} from cart`}
      className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 rounded-lg"
    >
      <Trash2 className="size-4.5" aria-hidden="true" />
    </button>
  );
};

import type { MarketplaceProduct } from "@/src/features/marketplace/types";

export type CartItem = MarketplaceProduct & {
  quantity: number;
};

export type CartCheckoutOrder = {
  id: string;
  sellerId: string;
  totalAmount: string | number;
  qrPayload: string | null;
};

export type CartCheckoutResponse = {
  checkoutId: string;
  orders: CartCheckoutOrder[];
  replayed: boolean;
};

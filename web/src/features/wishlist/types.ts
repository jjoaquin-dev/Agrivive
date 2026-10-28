import type { MarketplaceProduct } from "../marketplace/types";

export type BuyerWishlistResponse = {
  productIds: string[];
  products?: MarketplaceProduct[];
};

export type BuyerWishlistMutation = {
  productId: string;
  saved: boolean;
};

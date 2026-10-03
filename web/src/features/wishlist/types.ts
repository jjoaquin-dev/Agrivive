export type BuyerWishlistResponse = {
  productIds: string[];
};

export type BuyerWishlistMutation = {
  productId: string;
  saved: boolean;
};


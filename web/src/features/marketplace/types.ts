export type MarketplaceProductType =
  | "Leafy Greens"
  | "Root and Tuber Vegetables"
  | "Bulb and Stem Vegetables"
  | "Flower Vegetables"
  | "Fruit Vegetables"
  | "Seeds and Legumes";

export type MarketplaceUnit = "sack" | "kilo" | "pile";
export type MarketplaceSellerType = "supplier" | "supplier_vendor" | "retail_vendor";

export type MarketplaceSeller = {
  id: string;
  name: string;
  shopName: string;
  sellerType: MarketplaceSellerType;
  detailAddress: string;
  pickupInstructions: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number | null;
};

export type MarketplaceSellerMapResult = {
  id: string;
  name: string;
  image: string | null;
  shopName: string;
  sellerType: MarketplaceSellerType;
  detailAddress: string;
  pickupInstructions: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number | null;
  productCount: number;
};

export type MarketplaceSellerMapResponse = {
  sellers: MarketplaceSellerMapResult[];
  unmappedSellerCount: number;
};

export type MarketplaceSellerProfile = Pick<
  MarketplaceSeller,
  "id" | "shopName" | "sellerType" | "detailAddress" | "pickupInstructions" | "latitude" | "longitude"
> & {
  image: string | null;
};

export type MarketplaceProduct = {
  id: string;
  productName: string;
  imageUrl: string | null;
  productPrice: string | number;
  basePrice?: string | number | null;
  productQty: string | number;
  scalingType: MarketplaceUnit;
  productType: MarketplaceProductType;
  condition: string | null;
  availability: "available" | "sold_out";
  averageRating: string | null;
  reviewCount: number;
  seller: MarketplaceSeller;
};

export type MarketplaceProductResponse = {
  products: MarketplaceProduct[];
  nextCursor: string | null;
};

export type MarketplaceProductRecommendationResponse = {
  source: "none" | "synthetic" | "real";
  status: "disabled" | "demo" | "collecting" | "ready" | "unavailable";
  generatedAt: string | null;
  basketCount: number;
  recommendations: MarketplaceProduct[];
};

export type BuyerOrderItem = {
  id: string;
  productId: string;
  productName: string;
  productType: MarketplaceProductType | null;
  imageUrl: string | null;
  scalingType: MarketplaceUnit;
  quantity: string | number;
  unitPrice: string | number;
  subtotal: string | number;
};

export type BuyerOrder = {
  id: string;
  checkoutId: string;
  buyerId: string;
  sellerId: string;
  status: "pending" | "completed" | "cancelled" | "expired";
  cancelledBy: string | null;
  cancellationReason: string | null;
  totalAmount: string | number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: BuyerOrderItem[];
  qrPayload: string | null;
};

export type BuyerOrderResponse = {
  orders: BuyerOrder[];
  nextCursor: string | null;
};

export type SellerReviewItem = {
  id: string;
  rating: number;
  review: string | null;
  sellerResponse: string | null;
  buyerName: string;
  createdAt: string;
};

export type SellerReviewsResponse = {
  sellerId: string;
  count: number;
  average: string | null;
  breakdown: Record<number, number>;
  reviews: SellerReviewItem[];
};

export type ProductReviewItem = {
  id: string;
  rating: number;
  review: string | null;
  createdAt: string;
  buyerName: string;
};

export type ProductReviewsResponse = {
  productId: string;
  count: number;
  average: string | null;
  breakdown: Record<number, number>;
  reviews: ProductReviewItem[];
};

export type ProductReviewEligibility = {
  productId: string;
  purchases: {
    orderId: string;
    itemId: string;
    productName: string;
    review: {
      id: string;
      rating: number;
      review: string | null;
      createdAt: string;
    } | null;
  }[];
};

export type BuyerOrderReview = {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  rating: number;
  review: string | null;
  sellerResponse: string | null;
  createdAt: string;
};

export type BuyerProductReview = {
  id: string;
  orderId: string;
  orderedItemId: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  rating: number;
  review: string | null;
  createdAt: string;
};

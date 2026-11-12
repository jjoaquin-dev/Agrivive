export type MarketplaceProductType =
  | "Leafy Greens"
  | "Root Vegetables"
  | "Bulb Vegetables"
  | "Stem Vegetables"
  | "Flower Vegetables"
  | "Fruit Vegetables"
  | "Pod Vegetables"
  | "Tuber Vegetables"
  | "Seed Vegetables";

export type MarketplaceUnit = "sack" | "kilo" | "pile";

export type MarketplaceSeller = {
  id: string;
  name: string;
  image?: string | null;
  shopName: string;
  detailAddress: string;
  pickupInstructions: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number | null;
  /** Away: the seller cannot reply right now. Orders and pickup times stay as they are. */
  away?: boolean;
  closedToday?: boolean;
  trustedSeller?: boolean;
};

export type MarketplaceSellerMapResult = {
  id: string;
  name: string;
  image: string | null;
  shopName: string;
  detailAddress: string;
  pickupInstructions: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number | null;
  productCount: number;
  rating?: number | null;
  reviewCount?: number;
};

export type MarketplaceSellerMapResponse = {
  sellers: MarketplaceSellerMapResult[];
  unmappedSellerCount: number;
};

export type MarketplaceSellerProfile = Pick<
  MarketplaceSeller,
  "id" | "shopName" | "detailAddress" | "pickupInstructions" | "latitude" | "longitude"
> & {
  image: string | null;
  openingHours?: { weekday: number; isClosed: boolean; opensMinute: number; closesMinute: number }[];
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
  visibilityScore?: number | null;
  averageRating: string | null;
  reviewCount: number;
  seller: MarketplaceSeller;
};

export type MarketplaceProductResponse = {
  products: MarketplaceProduct[];
  nextCursor: string | null;
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
  status: "pending" | "completed" | "cancelled" | "expired" | "declined";
  cancelledBy: string | null;
  cancellationReason: string | null;
  totalAmount: string | number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: BuyerOrderItem[];
  qrPayload: string | null;
  pickupStart: string | null;
  pickupEnd: string | null;
  confirmedAt: string | null;
  expiredAt?: string | null;
  confirmationMode: "manual" | "auto" | null;
  progress: { steps: string[]; current: "placed" | "confirmed" | "preparing" | "ready" | "completed"; terminal: "expired" | "cancelled" | "declined" | null };
  qr: { status: "not_yet_valid" | "active" | "expired"; validFrom: string | null; validUntil: string | null };
  canCancel: boolean;
  cancelBlockedReason: string | null;
  disclaimer: string;
  stall?: { shopName: string; address: string; latitude: number | null; longitude: number | null; instructions: string | null; phone: string | null; directionsUrl: string | null; away: boolean } | null;
  decline?: { status: string; reason: string; reasonValid: boolean; sellerDueAt: string} | null;
  excuse?: { status: string; reason: string } | null;
  noShow?: { sequence: number; weight: number; excused: boolean } | null;
  reschedules?: { id: string; status: string; reason: string; newStart: string; newEnd: string; oldStart: string; oldEnd: string }[];
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
  photoUrl: string | null;
  sellerResponse: string | null;
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

/** One review per completed order: product stars, service stars, one comment, optional photo. */
export type BuyerOrderReview = {
  id: string;
  orderId: string;
  productRating: number | null;
  serviceRating: number;
  review: string | null;
  photoUrl: string | null;
  sellerResponse: string | null;
  createdAt: string;
  updatedAt: string | null;
  editableUntil: string;
};

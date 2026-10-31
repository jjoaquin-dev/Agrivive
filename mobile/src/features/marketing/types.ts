export type SellerBoostReason = "initial" | "price_reduction";
export type SellerVisibilityBoostStatus = "prompt" | "queued" | "sent" | "failed" | "dismissed";

export type BoostState =
  | "posting" | "posted" | "running" | "finished" | "not_posted" | "failed" | "needs_choice" | "dismissed";

export interface BoostPostEntry {
  type: "first_post" | "second_post";
  price: number;
  postedAt: string;
  postUrl: string | null;
}

export interface BoostProgress {
  state: BoostState;
  roundsDone: number;
  nextDropAt: string | null;
  posts: BoostPostEntry[];
}

/** The small Boost state sent with each listing for the chip on listing cards. */
export interface ProductBoostChip {
  state: BoostState;
  nextDropAt: string | null;
  roundsDone: number;
  priceDropPrompt: boolean;
}

export type BoostChannelStatus = "waiting" | "posting" | "posted" | "failed";

export interface BoostChannel {
  status: BoostChannelStatus;
  postUrl: string | null;
}

/** Facebook and Instagram answer on their own, so each one has its own status. */
export interface BoostChannels {
  facebook: BoostChannel;
  instagram: BoostChannel;
}

export interface SellerVisibilityBoost {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string | null;
  reason: SellerBoostReason;
  reductionPeriod: number;
  status: SellerVisibilityBoostStatus;
  priceBefore: string | null;
  priceAfter: string | null;
  createdAt: string;
  sentAt: string | null;
  errorMessage: string | null;
  progress?: BoostProgress | null;
  channels?: BoostChannels | null;
  currentPrice?: number | null;
  lowestPrice?: number | null;
}

export interface SellerProductBoostResponse {
  product: {
    id: string;
    productName: string;
    imageUrl: string | null;
    currentPrice: number;
    basePrice: number;
    quantity?: number | null;
    unit?: string | null;
    priceReductionPercent: number;
    lowestPrice?: number | null;
    priceReductionPeriodsApplied: number;
  };
  pricing: {
    currentPrice: number;
    basePrice: number;
    priceBefore: number;
    priceAfter: number;
    hasDiscount: boolean;
    reductionPeriodsApplied: number;
  };
  eligibility: {
    canBoost: boolean;
    hasInitialBoost: boolean;
    usedPosts: number;
    maxAllowedPosts: number;
    stage: "initial" | "price_reduction";
    headline: string;
    message: string;
    badge: "available" | "boosted";
  };
  boost: SellerVisibilityBoost | null;
}

export interface SellerBoostHistoryResponse {
  items: SellerVisibilityBoost[];
  total: number;
  nextCursor?: string | null;
}

/** The state shown to the seller. Older servers send no progress, so fall back to the stored status. */
export function boostState(boost: Pick<SellerVisibilityBoost, "status" | "progress">): BoostState {
  if (boost.progress) return boost.progress.state;
  switch (boost.status) {
    case "prompt": return "needs_choice";
    case "failed": return "failed";
    case "dismissed": return "dismissed";
    case "sent": return "posting";
    default: return "posting";
  }
}

export function boostStateLabel(state: BoostState) {
  switch (state) {
    case "posting": return "Posting now";
    case "posted": return "Posted";
    case "running": return "Running";
    case "finished": return "Finished";
    case "not_posted":
    case "failed": return "Did not post";
    case "needs_choice": return "Needs your choice";
    case "dismissed": return "Skipped";
  }
}

export function boostReasonLabel(reason: SellerBoostReason) {
  return reason === "price_reduction" ? "After price change" : "First boost";
}

export function formatBoostTime(value: string) {
  return new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/** The code shown on listing cards, so two listings with the same name can be told apart. */
export function productCode(productId: string) {
  return `PRD-${productId.slice(0, 4).toUpperCase()}`;
}

/** True when the listing already has a boost that was sent, so the card button opens it instead of starting one. */
export function hasActiveBoost(boost?: ProductBoostChip | null) {
  return boost ? ["posting", "posted", "running", "finished"].includes(boost.state) : false;
}

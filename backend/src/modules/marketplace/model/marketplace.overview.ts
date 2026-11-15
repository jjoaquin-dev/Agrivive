import { t } from "elysia";

/** Days are written YYYY-MM-DD on the Asia/Manila calendar. Both are optional; the service fills in sensible ones. */
export const marketplaceOverviewQuerySchema = t.Object({
  from: t.Optional(t.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  to: t.Optional(t.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
});

/** What one chart bar stands for. */
export type OverviewBucket = "day" | "week" | "month";

/** How a quantity is counted: kilo, sack or pile. Different units are never added together. */
export type OverviewUnit = "kg" | "sack" | "pile";

export interface UnitQuantity {
  unit: OverviewUnit;
  quantity: number;
}

export interface TopProduceItem {
  id: string;
  name: string;
  category: string;
  unit: OverviewUnit;
  quantity: number;
  orderCount: number;
  /** Average pesos paid for one unit, from completed pickups. */
  averagePrice: number;
}

export interface ActivityTrendPoint {
  label: string;
  detail: string;
  orderCount: number;
}

export interface CategoryDemandItem {
  category: string;
  /** Completed pickups in the range that included this category. */
  orderCount: number;
  orderShare: number;
  /** Listings live right now in this category. */
  activeListings: number;
  listingShare: number;
}

export interface WeekdayDemandItem {
  label: string;
  orderCount: number;
}

/** Totals only. Nothing here names or locates a seller, a stall or a buyer. */
export interface MarketplaceOverviewResponse {
  generatedAt: string;
  from: string;
  to: string;
  bucket: OverviewBucket;
  isSampleData: boolean;
  kpis: {
    completedPickups: number;
    produceTypesBought: number;
    activeListings: number;
    /** Completed pickups out of all reservations that ended in the range. Null when none ended. */
    pickupRate: number | null;
    quantityByUnit: UnitQuantity[];
  };
  topProduce: TopProduceItem[];
  activityTrends: ActivityTrendPoint[];
  categoryDemand: CategoryDemandItem[];
  weekdayDemand: WeekdayDemandItem[];
}

/** Plain-word explanations, one per chart, written from the totals above. */
export const explanationKeys = ["trend", "weekday", "produce", "price", "compare", "bought", "listed", "demand"] as const;
export type ExplanationKey = (typeof explanationKeys)[number];
export type MarketplaceOverviewExplanations = { source: "ai" | "template" } & Record<ExplanationKey, string>;

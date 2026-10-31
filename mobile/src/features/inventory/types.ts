import type { ProductBoostChip } from "../marketing/types";
export type ProductCategory =
  | "Leafy Greens"
  | "Root Vegetables"
  | "Bulb Vegetables"
  | "Stem Vegetables"
  | "Flower Vegetables"
  | "Fruit Vegetables"
  | "Pod Vegetables"
  | "Tuber Vegetables"
  | "Seed Vegetables";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Leafy Greens",
  "Root Vegetables",
  "Bulb Vegetables",
  "Stem Vegetables",
  "Flower Vegetables",
  "Fruit Vegetables",
  "Pod Vegetables",
  "Tuber Vegetables",
  "Seed Vegetables",
];

export type ProductScalingType = "kilo" | "sack" | "pile";

export interface VegetableCatalogItem {
  id: string;
  filipinoName: string;
  englishName: string;
  searchAliases: string[];
  category: ProductCategory;
  scientificName?: string | null;
  sourceUrl: string;
}

export const SCALING_TYPES: { label: string; value: ProductScalingType; unit: string }[] = [
  { label: "Kilogram (kg)", value: "kilo", unit: "kg" },
  { label: "Sack", value: "sack", unit: "sack" },
  { label: "Pile (Tumpok)", value: "pile", unit: "pile" },
];

export interface Product {
  id: string;
  userId: string;
  productName: string;
  vegetableCatalogId?: string | null;
  imagUrl?: string | null;
  displayImageUrl?: string | null;
  boost?: ProductBoostChip | null;
  productPrice: string | number;
  basePrice?: string | number | null;
  priceReductionPercent?: string | number;
  minimumPrice?: string | number | null;
  priceScheduleStartedAt?: string | null;
  nextPriceReductionAt?: string | null;
  productQty: string | number;
  originalQty?: string | number | null;
  lowStockThreshold?: string | number | null;
  publishedAt?: string | null;
  isMarketable: boolean;
  isActive: boolean;
  productType: ProductCategory;
  scalingType: ProductScalingType;
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = "available" | "low_stock" | "out_of_stock" | "archived";

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  scalingType: ProductScalingType;
  productType: ProductCategory;
  delta: string;
  beforeQty: string;
  afterQty: string;
  reason: string;
  createdAt: string;
}

export interface InventorySummary {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  activeCount: number;
  archivedCount: number;
  unitTotals: {
    kilo: number;
    sack: number;
    pile: number;
  };
}

export interface CreateProductInput {
  catalogId: string;
  imagUrl: string;
  productPrice: number;
  priceReductionPercent?: number;
  minimumPrice?: number | null;
  productQty: number;
  scalingType: ProductScalingType;
  isMarketable: boolean;
  lowStockThreshold?: number | null;
}

export interface UpdateProductInput {
  catalogId?: string;
  imagUrl?: string;
  productPrice?: number;
  priceReductionPercent?: number;
  minimumPrice?: number | null;
  isMarketable?: boolean;
  lowStockThreshold?: number | null;
}

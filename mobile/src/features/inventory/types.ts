export type ProductCategory =
  | "Leafy Greens"
  | "Root and Tuber Vegetables"
  | "Bulb and Stem Vegetables"
  | "Flower Vegetables"
  | "Fruit Vegetables"
  | "Seeds and Legumes";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Leafy Greens",
  "Root and Tuber Vegetables",
  "Bulb and Stem Vegetables",
  "Flower Vegetables",
  "Fruit Vegetables",
  "Seeds and Legumes",
];

export type ProductScalingType = "kilo" | "sack" | "pile";

export const SCALING_TYPES: { label: string; value: ProductScalingType; unit: string }[] = [
  { label: "Kilogram (kg)", value: "kilo", unit: "kg" },
  { label: "Sack", value: "sack", unit: "sack" },
  { label: "Pile (Tumpok)", value: "pile", unit: "pile" },
];

export interface Product {
  id: string;
  userId: string;
  productName: string;
  imagUrl?: string | null;
  displayImageUrl?: string | null;
  productPrice: string | number;
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
  productName: string;
  imagUrl: string;
  productPrice: number;
  productQty: number;
  productType: ProductCategory;
  scalingType: ProductScalingType;
  isMarketable: boolean;
  lowStockThreshold?: number | null;
}

export interface UpdateProductInput {
  productName?: string;
  imagUrl?: string;
  productPrice?: number;
  productType?: ProductCategory;
  isMarketable?: boolean;
  lowStockThreshold?: number | null;
}

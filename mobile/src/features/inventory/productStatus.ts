import { colors } from "../../theme";
import type { Product } from "./types";

export type ProductStatusKind = "selling" | "low" | "soldOut" | "archived";

export interface ProductStatus {
  kind: ProductStatusKind;
  label: string;
  color: string;
  background: string;
}

const STATUS: Record<ProductStatusKind, Omit<ProductStatus, "kind">> = {
  selling: { label: "Selling", color: colors.success, background: "#DCFCE7" },
  low: { label: "Running low", color: colors.warning, background: "#FFF7ED" },
  soldOut: { label: "Sold out", color: colors.error, background: "#FEF2F2" },
  archived: { label: "Archived", color: colors.textMuted, background: "#F3F4F6" },
};

/** One place that decides which status a listing shows, so the list and details always agree. */
export function getProductStatus(product: Product): ProductStatus {
  const qty = parseFloat(product.productQty as string) || 0;
  const threshold = product.lowStockThreshold != null ? parseFloat(product.lowStockThreshold as string) : null;
  const kind: ProductStatusKind = !product.isActive
    ? "archived"
    : qty <= 0
      ? "soldOut"
      : threshold != null && qty <= threshold
        ? "low"
        : "selling";
  return { kind, ...STATUS[kind] };
}

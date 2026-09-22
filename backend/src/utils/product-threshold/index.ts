import { OrderError } from "../order-types";

export function validateLowStockThreshold(value: number | null | undefined) {
  if (value == null) return;
  const scaled = value * 100;
  if (!Number.isFinite(value) || value < 0 || value > 99_999_999.99 ||
    Math.abs(scaled - Math.round(scaled)) > 0.00001) {
    throw new OrderError(400, "Low-stock threshold must be nonnegative with at most two decimal places");
  }
}

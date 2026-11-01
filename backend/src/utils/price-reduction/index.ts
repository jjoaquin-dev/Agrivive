import { OrderError } from "../order-types";

const twoDecimals = (value: number) => Math.round(value * 100) === value * 100;

/** Checks the peso drop and the final (lowest) price against the selling price. */
export function validatePriceReductionConfig(
  basePrice: number,
  amount: number | undefined,
  minimumPrice: number | null | undefined,
) {
  const drop = amount ?? 0;
  if (!Number.isFinite(drop) || drop < 0 || !twoDecimals(drop) || (drop > 0 && drop >= basePrice)) {
    throw new OrderError(400, "Price drop must be at least 0.01 and lower than the selling price, with at most two decimals");
  }
  if (minimumPrice !== undefined && minimumPrice !== null &&
    (!Number.isFinite(minimumPrice) || minimumPrice < 1 || minimumPrice > basePrice || !twoDecimals(minimumPrice))) {
    throw new OrderError(400, "Final price must be at least 1 and no higher than the selling price");
  }
  if (drop > 0 && (minimumPrice === undefined || minimumPrice === null)) {
    throw new OrderError(400, "A final price is required when a price drop is set");
  }
}

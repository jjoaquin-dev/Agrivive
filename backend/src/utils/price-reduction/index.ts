import { OrderError } from "../order-types";

export function validatePriceReductionConfig(
  basePrice: number,
  percent: number | undefined,
  minimumPrice: number | null | undefined,
) {
  const reduction = percent ?? 0;
  if (!Number.isFinite(reduction) || reduction < 0 || reduction > 99.99 ||
    Math.round(reduction * 100) !== reduction * 100) {
    throw new OrderError(400, "Price reduction must be between 0 and 99.99 percent with at most two decimals");
  }
  if (minimumPrice !== undefined && minimumPrice !== null &&
    (!Number.isFinite(minimumPrice) || minimumPrice < 1 || minimumPrice > basePrice ||
      Math.round(minimumPrice * 100) !== minimumPrice * 100)) {
    throw new OrderError(400, "Minimum price must be at least 1 and no higher than the base price");
  }
  if (reduction > 0 && (minimumPrice === undefined || minimumPrice === null)) {
    throw new OrderError(400, "A minimum price is required when price reduction is enabled");
  }
}

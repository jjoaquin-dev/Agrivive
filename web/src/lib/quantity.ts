/** Buyers can order part of a unit, such as half a kilo. One tap on + or - moves by half. */
export const QUANTITY_STEP = 0.5;
export const QUANTITY_MIN = 0.01;

export function roundQuantity(value: number) {
  return Math.round(value * 100) / 100;
}

/** Keeps a typed amount between the smallest order and what is in stock. */
export function clampQuantity(value: number, max: number) {
  const top = Number.isFinite(max) && max >= QUANTITY_MIN ? max : Number.POSITIVE_INFINITY;
  return Math.min(top, Math.max(QUANTITY_MIN, roundQuantity(value)));
}

/** "1.5", "2", never "2.00". */
export function formatQuantity(value: number) {
  return String(roundQuantity(value));
}

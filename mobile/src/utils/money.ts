/** One way to show pesos everywhere: ₱1,234.50. Pass 0 decimals for a whole-peso total. Empty or bad values show as ₱0.00. */
export function formatPeso(value: string | number | null | undefined, decimals = 2) {
  const n = Number(value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return `₱${safe.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

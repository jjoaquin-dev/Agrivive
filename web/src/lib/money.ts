const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** One price format for the whole site: ₱13, ₱12.68. */
export function formatPeso(value: string | number) {
  return pesoFormatter.format(Number(value));
}

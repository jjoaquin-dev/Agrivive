export const navCategories = [
  "All Categories",
  "Leafy Greens",
  "Fruit Vegetables",
  "Root Vegetables",
  "Pod Vegetables",
  "Tuber Vegetables",
  "Bulb Vegetables",
];

/** Marketplace address for a header search. Price and distance stay only when already on the marketplace. */
export function buildHeaderSearchUrl(current: string, keepFilters: boolean, query: string, category: string) {
  const params = new URLSearchParams(keepFilters ? current : "");
  params.delete("cursor");
  params.delete("search");
  params.delete("productType");
  if (query.trim()) params.set("search", query.trim());
  if (category !== "All Categories") params.set("productType", category);
  return `/marketplace?${params.toString()}`;
}

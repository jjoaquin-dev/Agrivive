export const VEGETABLE_CATALOG_SOURCE_URL =
  "https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide";

export const VEGETABLE_CATEGORIES = [
  "Leafy Greens",
  "Root Vegetables",
  "Bulb Vegetables",
  "Stem Vegetables",
  "Flower Vegetables",
  "Fruit Vegetables",
  "Pod Vegetables",
  "Tuber Vegetables",
  "Seed Vegetables",
] as const;

export type VegetableCategory = (typeof VEGETABLE_CATEGORIES)[number];

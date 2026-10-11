export function normalizeVegetableName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export function getVegetableCycleIdentity(
  vegetableCatalogId: string | null | undefined,
  vegetableKey: string,
  scalingType: string | null | undefined,
) {
  const vegetable = vegetableCatalogId ? "catalog:" + vegetableCatalogId : "name:" + vegetableKey;
  return vegetable + ":unit:" + (scalingType ?? "unknown");
}

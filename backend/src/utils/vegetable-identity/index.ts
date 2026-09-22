export function normalizeVegetableName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

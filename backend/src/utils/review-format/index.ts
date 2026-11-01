/** "Nena Cruz" becomes "Nena C." so reviews do not show a buyer's full name. */
export function formatReviewBuyerName(name: string | null | undefined): string {
  if (!name) return "Verified buyer";
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "Verified buyer";
  return `${parts[0]}${parts[1]?.[0] ? ` ${parts[1][0]}.` : ""}`;
}

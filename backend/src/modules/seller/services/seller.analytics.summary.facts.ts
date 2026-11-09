import type { SellerAnalyticsMetrics } from "../model/seller.analytics";

/** Every fact Groq is given. The saved summary is keyed on this text, so any change in these numbers makes a new summary. */
export function buildSummaryFacts(analytics: SellerAnalyticsMetrics) {
  const { metrics: m, notComputable, filter } = analytics;
  const word = filter.unit === "kilo" ? "kg" : filter.unit ? `${filter.unit}s` : "units";
  const lines = [
    `Produce: ${filter.productName ?? "all produce"}`,
    Number(m.postedQuantity) > 0
      ? `Posted for sale in these days: ${m.postedQuantity} ${word}`
      : "Posted for sale in these days: nothing new was posted (the pickups came from produce posted earlier)",
    `Picked up by buyers: ${m.completedQuantity} ${word}`,
    `Earned from pickups: ₱${m.completedSalesTotal}`,
    `Cancelled: ${m.cancelledQuantity} ${word}`,
    `Expired: ${m.expiredQuantity} ${word}`,
    `Repeat listings: ${m.recurringListings}`,
    notComputable.sellThroughRate || m.sellThroughRate === null
      ? "Share of posted produce that sold: cannot be worked out because nothing new was posted"
      : `Share of posted produce that sold: ${m.sellThroughRate.toFixed(2)}%`,
    notComputable.completedQuantityChange || m.completedQuantityChange === null
      ? "Change from the days before: cannot be compared because there were no sales before"
      : `Change in picked up amount from the days before: ${m.completedQuantityChange.toFixed(2)}%`,
  ];
  return lines.join("\n");
}

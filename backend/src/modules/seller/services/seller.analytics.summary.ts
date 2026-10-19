import type { SellerAnalyticsMetrics } from "../model/seller.analytics";

const pesos = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

export async function generateSellerAnalyticsSummary(
  analytics: SellerAnalyticsMetrics,
): Promise<{ summary: string; status: "generated" }> {
  const { metrics, notComputable, period, filter } = analytics;
  const subject = filter.productName ? `${filter.productName} completed sales` : "Completed sales";
  const unitLabel = filter.unit === "kilo" ? "kg" : filter.unit ? `${filter.unit}s` : "units";

  // 1. Period-to-Period Sales Trend (Equation 3)
  let trendSentence = "";
  if (notComputable.completedQuantityChange || metrics.completedQuantityChange === null) {
    trendSentence = Number(metrics.completedQuantity) > 0
      ? `${subject} trend could not be compared because no completed sales were recorded in the previous period (${period.previousFrom} to ${period.previousTo}).`
      : `No completed pickup sales were recorded from ${period.from} to ${period.to}.`;
  } else if (metrics.completedQuantityChange > 0) {
    trendSentence = `${subject} increased by ${metrics.completedQuantityChange.toFixed(2)}% compared to the previous period.`;
  } else if (metrics.completedQuantityChange < 0) {
    trendSentence = `${subject} decreased by ${Math.abs(metrics.completedQuantityChange).toFixed(2)}% compared to the previous period.`;
  } else {
    trendSentence = `${subject} remained unchanged compared to the previous period.`;
  }

  // 2. Volume and Sell-Through Rate (Equation 2)
  let volumeSentence = "";
  if (notComputable.sellThroughRate || metrics.sellThroughRate === null) {
    volumeSentence = "Sell-through could not be calculated because no surplus was posted during this period.";
  } else {
    volumeSentence = `A total of ${metrics.completedQuantity} ${unitLabel} was recorded as sold from the ${metrics.postedQuantity} ${unitLabel} posted, resulting in a ${metrics.sellThroughRate.toFixed(2)}% sell-through rate.`;
  }

  // 3. Revenue total and repeat listings
  const total = Number(metrics.completedSalesTotal);
  const revenueSentence = Number.isFinite(total) && total > 0
    ? `Completed pickups totaled ${pesos.format(total)}.`
    : "";
  const recurringSentence = metrics.recurringListings > 0
    ? `Repeat listings: ${metrics.recurringListings}.`
    : "";

  const sentences = [trendSentence, volumeSentence, revenueSentence, recurringSentence].filter(Boolean);
  return { summary: sentences.join(" "), status: "generated" };
}

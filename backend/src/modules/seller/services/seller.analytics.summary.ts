import type { SellerAnalyticsMetrics } from "../model/seller.analytics";

const pesos = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

export async function generateSellerAnalyticsSummary(
  analytics: SellerAnalyticsMetrics,
): Promise<{ summary: string; status: "generated" }> {
  const { metrics, notComputable, period } = analytics;
  const total = Number(metrics.completedSalesTotal);
  const sales = Number.isFinite(total) && total > 0
    ? `Completed pickups totaled ${pesos.format(total)} from ${period.from} to ${period.to}.`
    : `No completed pickup sales were recorded from ${period.from} to ${period.to}.`;
  const rate = notComputable.sellThroughRate || metrics.sellThroughRate === null
    ? "Sell-through could not be calculated for this period."
    : `Sell-through was ${metrics.sellThroughRate.toFixed(1)}%.`;
  const recurring = metrics.recurringListings > 0
    ? `Repeat listings: ${metrics.recurringListings}.`
    : "No repeat listings were recorded.";
  return { summary: `${sales} ${rate} ${recurring}`, status: "generated" };
}

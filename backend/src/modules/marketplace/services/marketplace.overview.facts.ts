import type { ExplanationKey, MarketplaceOverviewResponse } from "../model/marketplace.overview";

export type OverviewFacts = Record<ExplanationKey, string>;

const unit = (name: string, quantity: number) => (name === "kg" || quantity === 1 ? name : `${name}s`);

/** The exact numbers each chart explanation may use. Text written for a chart is checked against its own facts. */
export function buildOverviewFacts(overview: MarketplaceOverviewResponse): OverviewFacts {
  const { activityTrends: trend, topProduce, categoryDemand, weekdayDemand, kpis } = overview;
  const busiest = [...trend].sort((a, b) => b.orderCount - a.orderCount)[0];
  const empty = trend.filter((point) => point.orderCount === 0).length;
  const busyDay = [...weekdayDemand].sort((a, b) => b.orderCount - a.orderCount)[0];
  const weekdayTotal = weekdayDemand.reduce((sum, day) => sum + day.orderCount, 0);
  const none = "Nothing was recorded for these days.";

  return {
    trend: [
      `Days covered: ${overview.from} to ${overview.to}. Each bar is one ${overview.bucket}.`,
      `Completed pickups in total: ${kpis.completedPickups}.`,
      busiest && busiest.orderCount > 0 ? `Highest bar: ${busiest.detail} with ${busiest.orderCount} pickups.` : "No bar has a pickup.",
      `Bars with no pickups: ${empty} of ${trend.length}.`,
      `Bars: ${trend.map((point) => `${point.detail} ${point.orderCount}`).join("; ")}.`,
    ].join("\n"),
    weekday: weekdayTotal > 0
      ? `${weekdayDemand.map((day) => `${day.label} ${day.orderCount}`).join("; ")}. Busiest day: ${busyDay!.label} with ${busyDay!.orderCount}.`
      : "No completed pickups in these days.",
    produce: topProduce.length
      ? topProduce.map((item) => `${item.id}. ${item.name} (${item.category}): ${item.orderCount} orders, ${item.quantity} ${unit(item.unit, item.quantity)}.`).join("\n")
      : none,
    price: topProduce.length
      ? [...topProduce].sort((a, b) => b.averagePrice - a.averagePrice).map((item) => `${item.name} (${item.unit}): average ${item.averagePrice} pesos per ${item.unit}.`).join("\n")
      : none,
    compare: topProduce.length
      ? topProduce.map((item) => `${item.name} (${item.unit}): ${item.orderCount} orders, average ${item.averagePrice} pesos per ${item.unit}.`).join("\n")
      : none,
    bought: categoryDemand.some((item) => item.orderCount > 0)
      ? categoryDemand.filter((item) => item.orderCount > 0).map((item) => `${item.category}: ${item.orderShare}% of pickups (${item.orderCount} orders).`).join("\n")
      : none,
    listed: categoryDemand.some((item) => item.activeListings > 0)
      ? categoryDemand.filter((item) => item.activeListings > 0).map((item) => `${item.category}: ${item.listingShare}% of open listings (${item.activeListings} listings).`).join("\n")
      : none,
    demand: categoryDemand.length
      ? categoryDemand.map((item) => `${item.category}: ${item.orderShare}% of pickups (${item.orderCount} orders), ${item.listingShare}% of open listings (${item.activeListings} listings).`).join("\n")
      : none,
  };
}

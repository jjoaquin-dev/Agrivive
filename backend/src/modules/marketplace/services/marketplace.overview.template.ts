import type { ExplanationKey, MarketplaceOverviewResponse } from "../model/marketplace.overview";

const unit = (name: string, quantity: number) => (name === "kg" || quantity === 1 ? name : `${name}s`);
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** Fixed sentences, used when Groq is off, slow or writes a number it was not given. They only describe the totals. */
export function buildTemplateExplanations(overview: MarketplaceOverviewResponse): Record<ExplanationKey, string> {
  const { activityTrends: trend, topProduce, categoryDemand, weekdayDemand, kpis } = overview;
  const busiest = [...trend].sort((a, b) => b.orderCount - a.orderCount)[0];
  const busyDay = [...weekdayDemand].sort((a, b) => b.orderCount - a.orderCount)[0];
  const lead = topProduce[0];
  const priciest = [...topProduce].sort((a, b) => b.averagePrice - a.averagePrice)[0];
  const cheapest = [...topProduce].sort((a, b) => a.averagePrice - b.averagePrice)[0];
  const topBought = [...categoryDemand].sort((a, b) => b.orderShare - a.orderShare)[0];
  const topListed = [...categoryDemand].sort((a, b) => b.listingShare - a.listingShare)[0];
  const noPickups = "No orders were picked up in these days.";

  return {
    trend: kpis.completedPickups === 0
      ? noPickups
      : `Agrivive recorded ${plural(kpis.completedPickups, "order")} picked up in these days. The highest bar is ${busiest!.detail}, with ${plural(busiest!.orderCount, "pickup")}.`,
    weekday: busyDay && busyDay.orderCount > 0 ? `Most Agrivive pickups happened on ${busyDay.label}, with ${plural(busyDay.orderCount, "order")}.` : noPickups,
    produce: !lead
      ? noPickups
      : `On Agrivive, ${lead.name} was picked up most, in ${plural(lead.orderCount, "order")} (${lead.quantity} ${unit(lead.unit, lead.quantity)}).`,
    price: !priciest || !cheapest
      ? noPickups
      : `${priciest.name} had the highest average price, ${priciest.averagePrice} pesos per ${priciest.unit}. ${cheapest.name} had the lowest, ${cheapest.averagePrice} pesos per ${cheapest.unit}.`,
    compare: !lead
      ? noPickups
      : `Each dot is one produce. ${lead.name} was bought in the most orders (${lead.orderCount}), at an average of ${lead.averagePrice} pesos per ${lead.unit}.`,
    bought: !topBought || topBought.orderCount === 0
      ? noPickups
      : `${topBought.category} made up the biggest share of pickups, ${topBought.orderShare}% (${plural(topBought.orderCount, "order")}).`,
    listed: !topListed || topListed.activeListings === 0
      ? "No listings are open right now."
      : `${topListed.category} makes up the biggest share of the listings open now, ${topListed.listingShare}% (${plural(topListed.activeListings, "listing")}).`,
    demand: !topBought || topBought.orderCount === 0
      ? "Nothing was bought in these days, so there is no share to compare with the open listings."
      : `${topBought.category} made up ${topBought.orderShare}% of pickups and ${topBought.listingShare}% of the listings open now.`,
  };
}

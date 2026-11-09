import type { SellerAnalyticsQuery, SellerAnalyticsResponse } from "../model/seller.analytics";
import { getSellerAnalyticsMetrics } from "./seller.analytics.metrics";
import { getSellerAnalyticsInsights } from "./seller.analytics.insights";
import { generateSellerAnalyticsSummary } from "./seller.analytics.summary";

export async function getSellerAnalytics(
  sellerId: string,
  query: SellerAnalyticsQuery,
): Promise<SellerAnalyticsResponse> {
  const [metrics, insights] = await Promise.all([getSellerAnalyticsMetrics(sellerId, query), getSellerAnalyticsInsights(sellerId, query)]);
  const generated = await generateSellerAnalyticsSummary(sellerId, metrics);
  return { ...metrics, insights, summary: generated.summary, summaryStatus: generated.status, summarySource: generated.source };
}

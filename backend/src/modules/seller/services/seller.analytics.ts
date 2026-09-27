import type { SellerAnalyticsQuery, SellerAnalyticsResponse } from "../model/seller.analytics";
import { getSellerAnalyticsMetrics } from "./seller.analytics.metrics";
import { generateSellerAnalyticsSummary } from "./seller.analytics.summary";

export async function getSellerAnalytics(
  sellerId: string,
  query: SellerAnalyticsQuery,
): Promise<SellerAnalyticsResponse> {
  const metrics = await getSellerAnalyticsMetrics(sellerId, query);
  const generated = await generateSellerAnalyticsSummary(metrics);
  return { ...metrics, summary: generated.summary, summaryStatus: generated.status };
}

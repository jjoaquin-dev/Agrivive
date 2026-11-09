import type { SellerAnalyticsMetrics } from "../model/seller.analytics";
import { buildTemplateSummary } from "./seller.analytics.summary.template";
import { writeGroqSummary } from "./seller.analytics.summary.groq";
import { buildSummaryFacts } from "./seller.analytics.summary.facts";

type Entry = { summary: string | null; expiresAt: number };
const cache = new Map<string, Entry>();
const MAX_ENTRIES = 300;
const KEEP_MS = 30 * 60_000;
// A failed try is remembered briefly so a rate limit is not hit again on every refresh.
const RETRY_MS = 60_000;

export type SellerSummary = { summary: string; status: "generated"; source: "ai" | "template" };

/**
 * The report summary. Groq writes it from the computed numbers; the same facts reuse the saved text for 30 minutes, and any change in them writes a new one.
 * If Groq is off, slow, rate limited or writes a number it was not given, the template text is used instead.
 */
export async function generateSellerAnalyticsSummary(sellerId: string, analytics: SellerAnalyticsMetrics): Promise<SellerSummary> {
  const template = buildTemplateSummary(analytics);
  // Keyed on the exact facts Groq sees: new data changes a fact, so it always gets a fresh summary.
  const key = `${sellerId}:${buildSummaryFacts(analytics)}`;
  const now = Date.now();
  const saved = cache.get(key);
  if (saved && saved.expiresAt > now) {
    return saved.summary ? { summary: saved.summary, status: "generated", source: "ai" } : { summary: template, status: "generated", source: "template" };
  }
  const written = await writeGroqSummary(analytics);
  if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
  cache.set(key, { summary: written, expiresAt: now + (written ? KEEP_MS : RETRY_MS) });
  return written ? { summary: written, status: "generated", source: "ai" } : { summary: template, status: "generated", source: "template" };
}

import { askGroq } from "../../../utils/groq";
import type { SellerAnalyticsMetrics } from "../model/seller.analytics";
import { summaryUsesOnlyFacts } from "./seller.analytics.summary.check";
import { buildSummaryFacts } from "./seller.analytics.summary.facts";

const system = [
  "You write a short summary of a market seller's sales for the seller to read.",
  "Use only the facts you are given. Do not add advice, guesses, reasons or any number that is not in the facts.",
  "Write 2 or 3 short sentences in plain, simple words. Do not write dates. No lists, no markdown, no emojis.",
  "Say kg for kilos. Say pesos with the peso sign. Say what the facts say about posting and do not say more.",
].join(" ");

/** Groq's version of the summary, or null when Groq is unavailable or wrote a number we did not give it. */
export async function writeGroqSummary(analytics: SellerAnalyticsMetrics): Promise<string | null> {
  const facts = buildSummaryFacts(analytics);
  const text = (await askGroq({ system, user: `Facts:\n${facts}` }))?.replace(/[*_#`]/g, "").replace(/\s+/g, " ").trim();
  if (!text || text.length < 20 || text.length > 600) return null;
  if (!summaryUsesOnlyFacts(text, facts)) {
    console.warn("Groq summary used a number that was not in the facts; using the template");
    return null;
  }
  return text;
}

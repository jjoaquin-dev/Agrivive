import { askGroq } from "../../../utils/groq";
import { summaryUsesOnlyFacts } from "../../seller/services/seller.analytics.summary.check";
import { explanationKeys as keys, type MarketplaceOverviewExplanations } from "../model/marketplace.overview";
import { buildOverviewFacts, type OverviewFacts } from "./marketplace.overview.facts";
import { readMarketplaceOverview } from "./marketplace.overview";
import { buildTemplateExplanations } from "./marketplace.overview.template";

type Written = Partial<Record<keyof OverviewFacts, string>>;
type Entry = { written: Written | null; expiresAt: number };
const cache = new Map<string, Entry>();
const MAX_ENTRIES = 100;
const KEEP_MS = 30 * 60_000;
const RETRY_MS = 60_000;
const labels = { trend: "TREND", weekday: "WEEKDAY", produce: "PRODUCE", price: "PRICE", compare: "COMPARE", bought: "BOUGHT", listed: "LISTED", demand: "KIND" } as const;
// A description tells what happened. Words that look ahead or give advice are not allowed.
const forbidden = /\b(will|would|expect|expected|likely|should|could|predict|forecast|recommend|suggest|advise|going to|soon|trend continues|plan to|farmers? (?:can|may))\b/i;

const system = [
  "You write the short summary shown under each of eight charts on the public overview page of Agrivive, a vegetable marketplace in Davao City. The readers are farmers and the public.",
  "Write about what Agrivive recorded: name Agrivive or the platform as the source, and speak of orders picked up on Agrivive and listings open on Agrivive. Use a neutral, professional tone, as in an official report.",
  "Use only the facts you are given. Do not add advice, guesses, reasons, forecasts or any number that is not in the facts.",
  "Only say what already happened. Never say what will happen, what to plant, or what to do. Never name a person, shop or place.",
  "For each chart write 2 short sentences in plain, simple words. Name at most the three biggest items, and copy each item's number exactly as given. Never mention an item that has zero or is not listed. No lists, no markdown, no emojis.",
  "Say kg for kilos and pesos for money.",
  "Answer with exactly eight lines, each starting with its label and a colon: TREND:, WEEKDAY:, PRODUCE:, PRICE:, COMPARE:, BOUGHT:, LISTED:, KIND:.",
].join(" ");

function parse(text: string, facts: OverviewFacts): Written {
  const written: Written = {};
  for (const key of keys) {
    const match = new RegExp(`${labels[key]}\\s*:\\s*(.+)`, "i").exec(text);
    const line = match?.[1]?.replace(/[*_#`]/g, "").replace(/\s+/g, " ").trim();
    if (line && line.length >= 20 && line.length <= 400 && !forbidden.test(line) && summaryUsesOnlyFacts(line, facts[key])) written[key] = line;
  }
  return written;
}

/**
 * One plain-word explanation under each overview chart. Groq writes all eight from the computed totals only, and each line is
 * checked: it may not use a number it was not given, or look ahead. Any line that fails, or all of them when Groq is off or slow,
 * is replaced by fixed sentences. The same facts reuse the saved text for 30 minutes.
 */
export async function readOverviewExplanations(query: { from?: string; to?: string }): Promise<MarketplaceOverviewExplanations> {
  const overview = await readMarketplaceOverview(query);
  const facts = buildOverviewFacts(overview);
  const template = buildTemplateExplanations(overview);
  const cacheKey = keys.map((key) => facts[key]).join("\n--\n");
  const now = Date.now();

  let entry = cache.get(cacheKey);
  if (!entry || entry.expiresAt <= now) {
    const answer = await askGroq({
      system,
      user: keys.map((key) => `${labels[key]} facts:\n${facts[key]}`).join("\n\n"),
      maxTokens: 2400,
      timeoutMs: 15_000,
    });
    const written = answer ? parse(answer, facts) : null;
    entry = { written, expiresAt: now + (written && Object.keys(written).length ? KEEP_MS : RETRY_MS) };
    if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
    cache.set(cacheKey, entry);
  }

  const lines = Object.fromEntries(keys.map((key) => [key, entry!.written?.[key] ?? template[key]])) as Record<(typeof keys)[number], string>;
  const allAi = keys.every((key) => Boolean(entry!.written?.[key]));
  return { source: allAi ? "ai" : "template", ...lines };
}

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { generateSellerAnalyticsSummary } from "./seller.analytics.summary";
import { summaryUsesOnlyFacts } from "./seller.analytics.summary.check";
import type { SellerAnalyticsMetrics } from "../model/seller.analytics";

const analytics = (completed = "60.00"): SellerAnalyticsMetrics => ({
  period: { from: "2026-10-01", to: "2026-10-05", previousFrom: "2026-09-26", previousTo: "2026-09-30" },
  filter: { unit: "kilo" },
  metrics: {
    postedQuantity: "120.00", availableQuantity: "10.00", reservedQuantity: "70.00", completedQuantity: completed, cancelledQuantity: "4.00",
    expiredQuantity: "3.00", remainingQuantity: "12.00", completedSalesTotal: "1200.00", sellThroughRate: 50, completedQuantityChange: 20, recurringListings: 1,
  },
  notComputable: { sellThroughRate: false, completedQuantityChange: false },
});

const realFetch = globalThis.fetch;
let calls = 0;
const reply = (content: string, ok = true) => {
  globalThis.fetch = (async () => { calls++; return { ok, status: ok ? 200 : 429, json: async () => ({ choices: [{ message: { content } }] }) } as Response; }) as unknown as typeof fetch;
};
let seller = 0;
beforeEach(() => { calls = 0; seller++; process.env.GROQ_API_KEY = "test-key"; });
afterEach(() => { globalThis.fetch = realFetch; delete process.env.GROQ_API_KEY; });

describe("report summary written by Groq", () => {
  test("uses Groq's text when every number in it came from the facts", async () => {
    reply("You sold 60 kg out of 120 kg posted, which is 50%. Pickups brought in ₱1,200.00, up 20% from before.");
    const r = await generateSellerAnalyticsSummary(`s${seller}`, analytics());
    expect(r.source).toBe("ai");
    expect(r.summary).toContain("60 kg");
  });
  test("falls back to the template when Groq writes a number it was not given", async () => {
    reply("You sold 75 kg out of 120 kg posted, which is 62% of your produce.");
    const r = await generateSellerAnalyticsSummary(`s${seller}`, analytics("61.00"));
    expect(r.source).toBe("template");
    expect(r.summary).toContain("sell-through rate");
  });
  test("falls back to the template when Groq is rate limited", async () => {
    reply("", false);
    const r = await generateSellerAnalyticsSummary(`s${seller}`, analytics("62.00"));
    expect(r.source).toBe("template");
  });
  test("falls back to the template when there is no key, without calling Groq", async () => {
    delete process.env.GROQ_API_KEY;
    reply("should not be used");
    const r = await generateSellerAnalyticsSummary(`s${seller}`, analytics("63.00"));
    expect([r.source, calls]).toEqual(["template", 0]);
  });
  test("the same numbers reuse the saved text and call Groq once", async () => {
    reply("You sold 64 kg out of 120 kg posted. Pickups brought in ₱1,200.00.");
    const id = `s${seller}`;
    await generateSellerAnalyticsSummary(id, analytics("64.00"));
    await generateSellerAnalyticsSummary(id, analytics("64.00"));
    expect(calls).toBe(1);
    await generateSellerAnalyticsSummary(id, analytics("65.00"));
    expect(calls).toBe(2);
  });
  test("any new data writes a fresh summary, and only the same facts reuse the saved one", async () => {
    reply("You sold 66 kg out of 120 kg posted. Pickups brought in ₱1,200.00.");
    const id = `s${seller}`;
    await generateSellerAnalyticsSummary(id, analytics("66.00"));
    const moreCancelled = analytics("66.00"); moreCancelled.metrics.cancelledQuantity = "9.00";
    await generateSellerAnalyticsSummary(id, moreCancelled);
    expect(calls).toBe(2);
    const otherDays = analytics("66.00"); otherDays.period = { from: "2026-10-02", to: "2026-10-06", previousFrom: "2026-09-27", previousTo: "2026-10-01" };
    await generateSellerAnalyticsSummary(id, otherDays);
    expect(calls).toBe(2);
    await generateSellerAnalyticsSummary(`${id}-other`, analytics("66.00"));
    expect(calls).toBe(3);
  });
  test("the number check accepts rounding and refuses anything else", () => {
    const facts = "Picked up: 60.00 kg\nShare: 33.33%\nEarned: ₱1,200.00";
    expect(summaryUsesOnlyFacts("60 kg, about 33% and ₱1,200", facts)).toBe(true);
    expect(summaryUsesOnlyFacts("You sold 61 kg", facts)).toBe(false);
  });
});

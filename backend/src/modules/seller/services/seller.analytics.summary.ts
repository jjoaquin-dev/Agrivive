import type { SellerAnalyticsMetrics } from "../model/seller.analytics";

function resolveGroqTimeoutMs() {
  const configured = Number(process.env.GROQ_TIMEOUT_MS);
  return Number.isFinite(configured) && configured >= 2_000 && configured <= 30_000
    ? configured
    : 10_000;
}

export async function generateSellerAnalyticsSummary(
  analytics: SellerAnalyticsMetrics,
): Promise<{ summary: string | null; status: "generated" | "unavailable" }> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    console.warn("Groq analytics summary unavailable: GROQ_API_KEY is missing");
    return { summary: null, status: "unavailable" };
  }

  const model = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-20b";
  const supportsLowReasoning = [
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "qwen/qwen3.8-27b",
  ].includes(model);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), resolveGroqTimeoutMs());

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 320,
        ...(supportsLowReasoning ? { reasoning_effort: "low" } : {}),
        messages: [
          {
            role: "system",
            content: "Write a concise English seller analytics summary from the supplied JSON. Use only the supplied numbers. Mention no-sales periods when applicable. Do not invent advice, prices, quantities, statuses, or causes. Return two or three short sentences without a heading.",
          },
          { role: "user", content: JSON.stringify(analytics) },
        ],
      }),
    });

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 400);
      console.warn(`Groq analytics summary failed with HTTP ${response.status}`, detail);
      return { summary: null, status: "unavailable" };
    }
    const payload = await response.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      console.warn("Groq analytics summary returned no text");
      return { summary: null, status: "unavailable" };
    }
    return { summary: content.trim(), status: "generated" };
  } catch (error) {
    console.warn(
      "Groq analytics summary unavailable",
      error instanceof Error ? error.message : "request failed",
    );
    return { summary: null, status: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}

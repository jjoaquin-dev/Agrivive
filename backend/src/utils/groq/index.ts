const endpoint = "https://api.groq.com/openai/v1/chat/completions";

/**
 * One short chat answer from Groq, or null. It never throws: no key, a slow reply, a rate limit or any error all give null,
 * so callers can fall back to their own text.
 */
export async function askGroq(input: { system: string; user: string; model?: string; maxTokens?: number }): Promise<string | null> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key || key.startsWith("replace-with")) return null;
  // The same model the promotion captions already use in n8n.
  const model = input.model || process.env.GROQ_SUMMARY_MODEL?.trim() || "openai/gpt-oss-20b";
  const timeoutMs = Number(process.env.GROQ_TIMEOUT_MS) || 4000;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify({
        model,
        temperature: 0.2,
        // gpt-oss thinks before it answers, so it needs room for that and a low effort to stay fast.
        max_tokens: input.maxTokens ?? (model.includes("gpt-oss") ? 700 : 220),
        ...(model.includes("gpt-oss") ? { reasoning_effort: "low" } : {}),
        messages: [{ role: "system", content: input.system }, { role: "user", content: input.user }],
      }),
    });
    if (!response.ok) {
      console.warn("Groq request failed", response.status);
      return null;
    }
    const data = (await response.json()) as { choices?: { message?: { content?: string | null } }[] };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.warn("Groq request did not finish", error instanceof Error ? error.message : error);
    return null;
  }
}

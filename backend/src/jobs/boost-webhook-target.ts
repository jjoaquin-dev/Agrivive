/** The n8n Boost webhook and its service token, or null when missing or not safe to call. */
export function getBoostWebhookTarget() {
  const webhookUrl = process.env.N8N_VISIBILITY_BOOST_WEBHOOK_URL?.trim();
  const serviceToken = process.env.N8N_VISIBILITY_BOOST_SERVICE_TOKEN?.trim();
  if (!webhookUrl || !serviceToken) return null;
  try {
    const target = new URL(webhookUrl);
    if (target.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(target.hostname)) return null;
    return { target, serviceToken };
  } catch {
    return null;
  }
}

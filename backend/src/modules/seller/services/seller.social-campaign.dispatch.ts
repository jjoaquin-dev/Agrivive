import { OrderError } from "../../../utils/order-types";

export async function dispatchSocialCampaign(campaignId: string) {
  const webhookUrl = process.env.N8N_SOCIAL_PUBLISH_WEBHOOK_URL?.trim();
  const serviceToken = process.env.N8N_SOCIAL_SERVICE_TOKEN?.trim();
  if (!webhookUrl?.startsWith("https://") || !serviceToken) {
    throw new OrderError(503, "Social publishing is not set up yet");
  }
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${serviceToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Social workflow returned ${response.status}`);
}

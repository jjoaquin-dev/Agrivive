import { createHmac, randomBytes } from "node:crypto";
import { OrderError } from "../../../utils/order-types";

function encode(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

export async function publishXPost(text: string) {
  const consumerKey = process.env.SOCIAL_X_API_KEY?.trim();
  const consumerSecret = process.env.SOCIAL_X_API_SECRET?.trim();
  const accessToken = process.env.SOCIAL_X_ACCESS_TOKEN?.trim();
  const accessSecret = process.env.SOCIAL_X_ACCESS_TOKEN_SECRET?.trim();
  if (!consumerKey || !consumerSecret || !accessToken || !accessSecret) {
    throw new OrderError(503, "X publishing is not configured");
  }
  const url = "https://api.x.com/2/tweets";
  const oauth: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };
  const normalized = Object.entries(oauth).sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${encode(key)}=${encode(value)}`).join("&");
  const base = `POST&${encode(url)}&${encode(normalized)}`;
  const secret = `${encode(consumerSecret)}&${encode(accessSecret)}`;
  oauth.oauth_signature = createHmac("sha1", secret).update(base).digest("base64");
  const authorization = `OAuth ${Object.entries(oauth).sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${encode(key)}="${encode(value)}"`).join(", ")}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: authorization, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(30_000),
  });
  const result = await response.json().catch(() => ({})) as { data?: { id?: string } };
  const id = result.data?.id;
  if (!response.ok || !id) throw new Error("X could not publish this post");
  return { postId: id, postUrl: `https://x.com/i/status/${id}` };
}

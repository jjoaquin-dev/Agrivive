import { OrderError } from "../../../utils/order-types";

type GraphError = { error?: { message?: string; code?: number; error_subcode?: number } };

// Meta codes for "too many calls": app limit (4), user limit (17), page limit (32), and the throttling codes 613 and 80002.
const RATE_LIMIT_CODES = new Set([4, 17, 32, 613, 80002]);
const COOL_DOWN_MS = 60 * 60_000;
// shortcut: kept in memory, so it resets when the API restarts. Upgrade to a database value if restarts happen often.
let coolDownUntil = 0;

function describe(result: GraphError, status: number) {
  const code = result.error?.code
    ? `code ${result.error.code}${result.error.error_subcode ? `/${result.error.error_subcode}` : ""}`
    : `HTTP ${status}`;
  return [code, result.error?.message?.slice(0, 160)].filter(Boolean).join(": ");
}

async function graph(url: string, token: string, body?: URLSearchParams) {
  let response: Response;
  try {
    response = await fetch(url, {
      method: body ? "POST" : "GET",
      headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}) },
      body,
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    console.error("Instagram Graph API request failed", { message: error instanceof Error ? error.message : "unknown" });
    throw new OrderError(502, "Instagram could not publish this post (could not reach Instagram)");
  }
  const result = await response.json().catch(() => ({})) as GraphError & Record<string, unknown>;
  if (!response.ok) {
    console.error("Instagram Graph API call failed", { status: response.status, ...result.error });
    if (result.error?.code && RATE_LIMIT_CODES.has(result.error.code)) coolDownUntil = Date.now() + COOL_DOWN_MS;
    throw new OrderError(502, `Instagram could not publish this post (${describe(result, response.status)})`);
  }
  return result;
}

/** Instagram wants the photo fetched and checked before it can be published. */
async function waitUntilReady(host: string, containerId: string, token: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    // Wait first: Instagram needs a few seconds to fetch the photo, so an instant check only wastes a call.
    await new Promise((resolve) => setTimeout(resolve, 3_000));
    const result = await graph(`${host}/${containerId}?fields=status_code`, token) as { status_code?: string };
    if (result.status_code === "FINISHED") return;
    if (result.status_code === "ERROR" || result.status_code === "EXPIRED") {
      throw new OrderError(502, "Instagram could not publish this post (the photo was not accepted)");
    }
  }
  throw new OrderError(502, "Instagram could not publish this post (the photo took too long to check)");
}

export async function publishInstagramPhoto(imageUrl: string, caption: string) {
  const instagramId = process.env.SOCIAL_INSTAGRAM_USER_ID?.trim();
  const token = process.env.SOCIAL_META_PAGE_ACCESS_TOKEN?.trim();
  const version = process.env.META_GRAPH_API_VERSION?.trim();
  if (!instagramId || !token || !version) throw new OrderError(503, "Instagram publishing is not configured");
  // After Meta says "too many calls", stop calling it for a while. More calls only make the wait longer.
  if (Date.now() < coolDownUntil) throw new OrderError(503, "Instagram is busy right now. It will work again in about an hour.");
  const host = `https://graph.facebook.com/${version}`;

  const created = await graph(`${host}/${instagramId}/media`, token, new URLSearchParams({ image_url: imageUrl, caption })) as { id?: string };
  if (!created.id) throw new OrderError(502, "Instagram could not publish this post (no photo was prepared)");
  await waitUntilReady(host, created.id, token);

  const published = await graph(`${host}/${instagramId}/media_publish`, token, new URLSearchParams({ creation_id: created.id })) as { id?: string };
  if (!published.id) throw new OrderError(502, "Instagram could not publish this post (no post was created)");

  const link = await graph(`${host}/${published.id}?fields=permalink`, token).catch(() => ({})) as { permalink?: string };
  return { postId: published.id, postUrl: link.permalink ?? null };
}

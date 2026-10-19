import { OrderError } from "../../../utils/order-types";

export async function publishInstagramPhoto(imageUrl: string, caption: string) {
  const instagramId = process.env.SOCIAL_INSTAGRAM_USER_ID?.trim();
  const token = process.env.SOCIAL_META_PAGE_ACCESS_TOKEN?.trim();
  const version = process.env.META_GRAPH_API_VERSION?.trim();
  if (!instagramId || !token || !version) throw new OrderError(503, "Instagram publishing is not configured");
  const host = `https://graph.facebook.com/${version}`;
  const base = `${host}/${instagramId}`;
  const create = await fetch(`${base}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ image_url: imageUrl, caption }),
    signal: AbortSignal.timeout(30_000),
  });
  const created = await create.json().catch(() => ({})) as { id?: string };
  if (!create.ok || !created.id) throw new Error("Instagram could not prepare this post");

  const publish = await fetch(`${base}/media_publish`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ creation_id: created.id }),
    signal: AbortSignal.timeout(30_000),
  });
  const result = await publish.json().catch(() => ({})) as { id?: string };
  if (!publish.ok || !result.id) throw new Error("Instagram could not publish this post");
  const permalinkResponse = await fetch(`${host}/${result.id}?fields=permalink,shortcode`, {
    headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  const permalinkResult = await permalinkResponse?.json().catch(() => ({})) as { permalink?: string; shortcode?: string } | undefined;
  const postUrl = permalinkResult?.permalink || (permalinkResult?.shortcode ? `https://www.instagram.com/p/${permalinkResult.shortcode}/` : null);
  return { postId: result.id, postUrl };
}

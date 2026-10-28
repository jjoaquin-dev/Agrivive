import { OrderError } from "../../../utils/order-types";

export async function publishFacebookPagePhoto(imageUrl: string, caption: string) {
  const pageId = process.env.SOCIAL_FACEBOOK_PAGE_ID?.trim();
  const token = process.env.SOCIAL_META_PAGE_ACCESS_TOKEN?.trim();
  const version = process.env.META_GRAPH_API_VERSION?.trim();
  if (!pageId || !token || !version) throw new OrderError(503, "Facebook publishing is not configured");
  let response: Response;
  try {
    response = await fetch(`https://graph.facebook.com/${version}/${pageId}/photos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url: imageUrl, caption, published: "true" }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    const cause = error instanceof Error && "cause" in error
      ? error.cause as { code?: string; message?: string }
      : undefined;
    console.error("Facebook Graph API request failed", {
      name: error instanceof Error ? error.name : "unknown",
      message: error instanceof Error ? error.message : "unknown",
      causeCode: cause?.code,
      causeMessage: cause?.message,
    });
    throw new Error("Facebook could not publish this post");
  }
  const result = await response.json().catch(() => ({})) as {
    id?: string;
    post_id?: string;
    error?: {
      message?: string;
      type?: string;
      code?: number;
      error_subcode?: number;
    };
  };
  const id = result.post_id ?? result.id;
  if (!response.ok || !id) {
    console.error("Facebook Graph API publish failed", {
      status: response.status,
      type: result.error?.type,
      code: result.error?.code,
      subcode: result.error?.error_subcode,
      message: result.error?.message,
    });
    throw new Error("Facebook could not publish this post");
  }
  return { postId: id, postUrl: `https://www.facebook.com/${id}` };
}

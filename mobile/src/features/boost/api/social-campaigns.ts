import { apiFetch } from "../../../api/client";

export type SocialPlatform = "facebook" | "instagram" | "x";
export type HistoricalSocialPlatform = SocialPlatform | "tiktok";
export type SocialChannel = {
  platform: SocialPlatform;
  label: string;
  captionLimit: number;
  configured: boolean;
};
export type SocialPost = {
  platform: HistoricalSocialPlatform;
  status: "queued" | "processing" | "published" | "failed";
  postUrl: string | null;
  lastError: string | null;
};
export type SocialDraft = {
  campaignId: string;
  status: string;
  productName: string;
  imageUrl: string | null;
  posts: Partial<Record<SocialPlatform, string>>;
};
export type CampaignStatus = {
  id: string;
  productName: string;
  imageUrl: string | null;
  status: string;
  posts: Record<string, string>;
  lastError: string | null;
  results: SocialPost[];
};

const sellerPath = "/seller";

export async function fetchSocialChannels() {
  return apiFetch<{ channels: SocialChannel[] }>(`${sellerPath}/social-campaigns/channels`);
}

export async function createSocialDraft(productId: string) {
  return apiFetch<SocialDraft>(`${sellerPath}/social-campaigns/draft`, {
    method: "POST", body: JSON.stringify({ productId }),
  }, 60_000);
}

export async function publishSocialDraft(input: {
  campaignId: string;
  platforms: SocialPlatform[];
  posts: Partial<Record<SocialPlatform, string>>;
}) {
  const { campaignId, ...body } = input;
  return apiFetch<{ campaignId: string; status: string }>(
    `${sellerPath}/social-campaigns/${campaignId}/publish`,
    { method: "POST", body: JSON.stringify(body) }, 20_000,
  );
}

export async function retrySocialDraft(campaignId: string) {
  return apiFetch<{ campaignId: string; status: string; retrying: HistoricalSocialPlatform[] }>(
    `${sellerPath}/social-campaigns/${campaignId}/retry`, { method: "POST" }, 20_000,
  );
}

export async function fetchSocialCampaign(campaignId: string) {
  return apiFetch<CampaignStatus>(`${sellerPath}/social-campaigns/${campaignId}`);
}

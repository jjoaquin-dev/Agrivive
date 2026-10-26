import type { SocialPublishPlatform } from "../social-promotion-content";

export type SocialChannel = {
  platform: SocialPublishPlatform;
  label: string;
  captionLimit: number;
  configured: boolean;
};

function hasValue(name: string) {
  return Boolean(process.env[name]?.trim());
}

export function getSocialChannelAvailability(): SocialChannel[] {
  const publicApi = process.env.SOCIAL_PUBLIC_API_URL?.trim() ?? "";
  const workflowReady = (process.env.N8N_SOCIAL_PUBLISH_WEBHOOK_URL?.trim() ?? "").startsWith("https://") &&
    hasValue("N8N_SOCIAL_SERVICE_TOKEN") && hasValue("GROQ_API_KEY");
  const isDev = process.env.NODE_ENV !== "production" || publicApi.includes("localhost") || publicApi.includes("127.0.0.1");
  const metaReady = workflowReady && hasValue("META_GRAPH_API_VERSION") &&
    hasValue("SOCIAL_FACEBOOK_PAGE_ID") &&
    hasValue("SOCIAL_META_PAGE_ACCESS_TOKEN") &&
    (publicApi.startsWith("https://") || isDev);

  return [
    { platform: "facebook", label: "Agrivive on Facebook", captionLimit: 2_000, configured: metaReady },
    {
      platform: "instagram",
      label: "Agrivive on Instagram",
      captionLimit: 2_200,
      configured: metaReady && hasValue("SOCIAL_INSTAGRAM_USER_ID"),
    },
  ];
}

import { t } from "elysia";

export const sellerSocialCampaignProductParams = t.Object({ productId: t.String({ format: "uuid" }) });
export const sellerSocialCampaignParams = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerSocialCampaignPlatform = t.Union([
  t.Literal("facebook"), t.Literal("instagram"),
]);
export const sellerSocialCampaignCreateBody = t.Object({ productId: t.String({ format: "uuid" }) });
export const sellerSocialCampaignPublishBody = t.Object({
  platforms: t.Array(sellerSocialCampaignPlatform, { minItems: 1, maxItems: 2 }),
  posts: t.Record(t.String(), t.String({ maxLength: 2200 })),
});

export type SellerSocialCampaignPublishInput = typeof sellerSocialCampaignPublishBody.static;
export type SocialPublishPlatform = typeof sellerSocialCampaignPlatform.static;

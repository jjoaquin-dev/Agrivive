import { getSocialChannelAvailability } from "../../../utils/social-publishing";

export async function listSellerSocialCampaignChannels() {
  return { channels: getSocialChannelAvailability() };
}

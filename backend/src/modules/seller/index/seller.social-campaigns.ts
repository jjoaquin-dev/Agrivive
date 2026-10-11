import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerSocialCampaignCreateBody, sellerSocialCampaignParams, sellerSocialCampaignProductParams, sellerSocialCampaignPublishBody } from "../model/seller.social-campaigns";
import { listSellerSocialCampaignChannels } from "../services/seller.social-campaign.channels";
import { createSellerSocialCampaignDraft } from "../services/seller.social-campaign.create";
import { publishSellerSocialCampaign } from "../services/seller.social-campaign.publish";
import { readSellerSocialCampaign } from "../services/seller.social-campaign.read";
import { retrySellerSocialCampaign } from "../services/seller.social-campaign.retry";

function failure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error("Seller social campaign request failed", error);
  return status(500, { message: "Boost Visibility could not be completed" });
}

export const sellerSocialCampaignsRoute = new Elysia().use(sessionAuth)
  .get("/social-campaigns/channels", async ({ status }) => {
    try { return await listSellerSocialCampaignChannels(); }
    catch (error) { return failure(error, status); }
  }, { role: ["seller"] })
  .post("/social-campaigns/draft", async ({ session, body, status }) => {
    try { return await createSellerSocialCampaignDraft(session.userId, body.productId); }
    catch (error) { return failure(error, status); }
  }, { role: ["seller"], body: sellerSocialCampaignCreateBody })
  .get("/social-campaigns/:id", async ({ session, params, status }) => {
    try { return await readSellerSocialCampaign(session.userId, params.id); }
    catch (error) { return failure(error, status); }
  }, { role: ["seller"], params: sellerSocialCampaignParams })
  .post("/social-campaigns/:id/publish", async ({ session, params, body, status }) => {
    try { return await publishSellerSocialCampaign(session.userId, params.id, body); }
    catch (error) { return failure(error, status); }
  }, { role: ["seller"], params: sellerSocialCampaignParams, body: sellerSocialCampaignPublishBody })
  .post("/social-campaigns/:id/retry", async ({ session, params, status }) => {
    try { return await retrySellerSocialCampaign(session.userId, params.id); }
    catch (error) { return failure(error, status); }
  }, { role: ["seller"], params: sellerSocialCampaignParams });

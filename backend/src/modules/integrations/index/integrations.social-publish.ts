import { timingSafeEqual } from "node:crypto";
import Elysia, { t } from "elysia";
import { OrderError } from "../../../utils/order-types";
import { getSocialPublishContext } from "../services/integrations.social-publish-context";
import { dispatchSocialCampaignPlatform } from "../services/integrations.social-publish-dispatch";

const params = t.Object({ id: t.String({ format: "uuid" }) });
const publishParams = t.Object({
  id: t.String({ format: "uuid" }),
  platform: t.Union([
    t.Literal("facebook"),
    t.Literal("instagram"),
  ]),
});

function isSocialServiceAuthorized(authorization?: string) {
  const expected = process.env.N8N_SOCIAL_SERVICE_TOKEN?.trim();
  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  const provided = Buffer.from(authorization.slice(7).trim());
  const expectedBytes = Buffer.from(expected);
  return (
    provided.length === expectedBytes.length &&
    provided.length > 0 &&
    timingSafeEqual(provided, expectedBytes)
  );
}

function failure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError)
    return status(error.statusCode, { message: error.message });
  console.error("Social publishing integration failed", error);
  return status(500, { message: "Social publishing is unavailable" });
}

export const integrationsSocialPublishRoute = new Elysia()

  .get(
    "/integrations/social-campaigns/:id/context",
    async ({ headers, params: routeParams, status }) => {
      if (!isSocialServiceAuthorized(headers.authorization))
        return status(401, {
          message: "Social publishing authentication required",
        });
      try {
        return await getSocialPublishContext(routeParams.id);
      } catch (error) {
        return failure(error, status);
      }
    },
    { params, headers: t.Object({ authorization: t.Optional(t.String()) }) },
  )

  .post(
    "/integrations/social-campaigns/:id/publish/:platform",
    async ({ headers, params: routeParams, status }) => {
      if (!isSocialServiceAuthorized(headers.authorization))
        return status(401, {
          message: "Social publishing authentication required",
        });
      try {
        return await dispatchSocialCampaignPlatform(
          routeParams.id,
          routeParams.platform,
        );
      } catch (error) {
        return failure(error, status);
      }
    },
    {
      params: publishParams,
      headers: t.Object({ authorization: t.Optional(t.String()) }),
    },
  );

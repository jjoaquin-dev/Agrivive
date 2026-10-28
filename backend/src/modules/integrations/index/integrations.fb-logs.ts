import Elysia, { t } from "elysia";
import { createFacebookPostLog } from "../services/integrations.fb-logs";

export const integrationsFbLogsRoute = new Elysia()
  .post(
    "/integrations/social/fb-logs",
    async ({ body, status }) => {
      try {
        return await createFacebookPostLog(body);
      } catch (error) {
        console.error("Failed to store facebook post log", error);
        return status(500, { message: "Could not record post log" });
      }
    },
    {
      body: t.Object({
        productId: t.String({ format: "uuid" }),
        postType: t.Union([t.Literal("first_post"), t.Literal("second_post")]),
        facebookPostId: t.Optional(t.String()),
        price: t.String(),
        status: t.Union([t.Literal("success"), t.Literal("failed")]),
      }),
    },
  );

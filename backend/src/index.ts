import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import { cors } from "@elysia/cors";
import openapi from "@elysia/openapi";
import { sellerRoute } from "./modules/seller";
import { buyerRoute } from "./modules/buyer";
import { adminRoute } from "./modules/admin";
import { marketplaceRoute } from "./modules/marketplace";
import { stakeholderRoute } from "./modules/stakeholder";
import { integrationsRoute } from "./modules/integrations";
import { integrationsSocialProductImageRoute } from "./modules/integrations/index/integrations.social-product-image";
import { integrationsSocialPublishRoute } from "./modules/integrations/index/integrations.social-publish";
import { conversationsRoute } from "./modules/conversations";
import { notificationsRoute } from "./modules/notifications";
import { trustRoute } from "./modules/trust";
import { validationPlugin } from "./plugins/validation.plugin";
import { db } from "./db";
import { sql } from "drizzle-orm";

const configuredWebOrigins = (process.env.WEB_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const localWebOrigin = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;
const webCorsOrigin = configuredWebOrigins.length
  ? [...configuredWebOrigins, localWebOrigin]
  : localWebOrigin;

const app = new Elysia()
  .use(cors({ origin: webCorsOrigin, credentials: true }))

  //openapi
  .use(openapi())

  //auth hadler
  .mount(auth.handler)

  //routes
  .use(buyerRoute)
  .use(sellerRoute)
  .use(adminRoute)
  .use(marketplaceRoute)
  .use(stakeholderRoute)
  .use(conversationsRoute)
  .use(notificationsRoute)
  .use(trustRoute)
  .use(integrationsRoute)
  .use(integrationsSocialProductImageRoute)
  .use(integrationsSocialPublishRoute)
  .get("/", () => "Hello Elysia")
  .get("/health", () => ({ status: "ok" }))
  .get("/health/ready", async ({ status }) => {
    try {
      await db.execute(sql`select 1`);
      return { status: "ready" };
    } catch (error) {
      console.error("Readiness check failed", error);
      return status(503, { status: "not_ready" });
    }
  })

  //plugins
  .use(validationPlugin)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

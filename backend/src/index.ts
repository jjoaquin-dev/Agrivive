process.env.NODE_ENV = process.env.NODE_ENV || "development";

import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import { authPasswordRoute } from "./modules/auth/index/auth.password";
import { authRoleRegisterRoute } from "./modules/auth/index/auth.role-register";
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
import { integrationsVisibilityBoostRoute } from "./modules/integrations/index/integrations.visibility-boost";
import { integrationsProductPriceRoute } from "./modules/integrations/index/integrations.product-price";
import { integrationsFbLogsRoute } from "./modules/integrations/index/integrations.fb-logs";
import { integrationsProductContextRoute } from "./modules/integrations/index/integrations.product-context";
import { conversationsRoute } from "./modules/conversations";
import { notificationsRoute } from "./modules/notifications";
import { trustRoute } from "./modules/trust";
import { validationPlugin } from "./plugins/validation.plugin";
import { securityHeadersPlugin } from "./plugins/security-headers.plugin";
import { rateLimitPlugin } from "./plugins/rate-limit.plugin";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { deliverPushNotifications } from "./jobs/deliver-push-notifications";

const isDev = process.env.NODE_ENV !== "production";

const configuredWebOrigins = (process.env.WEB_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const localWebOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/;
const webCorsOrigin = configuredWebOrigins.length
  ? (isDev ? [...configuredWebOrigins, localWebOrigin] : configuredWebOrigins)
  : localWebOrigin;

const openapiPlugin = isDev ? openapi() : new Elysia({ name: "noop-openapi" });

const app = new Elysia()
  .use(securityHeadersPlugin)
  .use(rateLimitPlugin)
  .use(cors({ origin: webCorsOrigin, credentials: true }))

  //openapi
  .use(openapiPlugin)

  //auth hadler
  .mount(auth.handler)
  .use(authPasswordRoute)
  .use(authRoleRegisterRoute)


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
  .use(integrationsVisibilityBoostRoute)
  .use(integrationsProductPriceRoute)
  .use(integrationsFbLogsRoute)
  .use(integrationsProductContextRoute)
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

// Process and deliver queued push notifications every 30 seconds
setInterval(async () => {
  try {
    await deliverPushNotifications();
  } catch (error) {
    console.error("[Push] Auto-delivery error:", error);
  }
}, 30_000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import { cors } from "@elysia/cors";
import openapi from "@elysia/openapi";
import { sellerRoute } from "./modules/seller";
import { buyerRoute } from "./modules/buyer";
import { adminRoute } from "./modules/admin";
import { marketplaceRoute } from "./modules/marketplace";
import { stakeholderRoute } from "./modules/stakeholder";
import { expirePendingOrders } from "./modules/buyer/services/buyer.order.expire";
import { validationPlugin } from "./plugins/validation.plugin";
import { processInquiryDeadlines } from "./utils/trust/process-inquiries";
import { sendPendingTrustNotices } from "./utils/trust/send-notices";
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
  .get("/", () => "Hello Elysia")
  .get("/a", () => "Hello Elysia")
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

let expiryRunning = false;
async function runOrderExpiry() {
  if (expiryRunning) return;
  expiryRunning = true;
  try {
    await expirePendingOrders();
  } catch (error) {
    console.error("Failed to expire pending orders", error);
  } finally {
    expiryRunning = false;
  }
}

void runOrderExpiry();
setInterval(() => void runOrderExpiry(), 60_000);

let trustJobsRunning = false;
async function runTrustJobs() {
  if (trustJobsRunning) return;
  trustJobsRunning = true;
  try {
    await processInquiryDeadlines();
    await sendPendingTrustNotices();
  } catch (error) {
    console.error("Failed to process trust jobs", error);
  } finally {
    trustJobsRunning = false;
  }
}
void runTrustJobs();
setInterval(() => void runTrustJobs(), 60_000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

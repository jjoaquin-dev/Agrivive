import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import openapi from "@elysia/openapi";
import { sellerRoute } from "./modules/seller";
import { buyerRoute } from "./modules/buyer";
import { adminRoute } from "./modules/admin";
import { expirePendingOrders } from "./modules/buyer/services/buyer.order.expire";
import { validationPlugin } from "./plugins/validation.plugin";
import { processInquiryDeadlines } from "./utils/trust/process-inquiries";
import { sendPendingTrustNotices } from "./utils/trust/send-notices";

const app = new Elysia()

  //openapi
  .use(openapi())

  //auth hadler
  .mount(auth.handler)

  //routes
  .use(buyerRoute)
  .use(sellerRoute)
  .use(adminRoute)
  .get("/", () => "Hello Elysia")
  .get("/a", () => "Hello Elysia")

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

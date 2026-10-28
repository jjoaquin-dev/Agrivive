import { and, asc, eq, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "../db";
import { notification_devices, notification_outbox } from "../db/schema";
import { sendPushNotificationBatch, type PushNotificationMessage } from "../utils/push-notifications";

const batchLimit = 50;
const deviceBatchSize = 500;
const maxAttempts = () => Math.max(1, Number(process.env.PUSH_MAX_ATTEMPTS ?? 4));

type OutboxJob = typeof notification_outbox.$inferSelect;

function notificationContent(job: OutboxJob) {
  const payload = job.payload ?? {};
  if (job.type === "seller_listing") {
    const productName = typeof payload.productName === "string" ? payload.productName : "Fresh produce";
    const shopName = typeof payload.shopName === "string" ? payload.shopName : "A seller you follow";
    const eventType = payload.eventType as string | undefined;
    const metadata = (payload.metadata ?? {}) as Record<string, unknown>;
    const path = `/products/${String(payload.productId ?? "")}`;
    if (eventType === "price_drop") {
      const priceStr = metadata.newPrice ? ` to ₱${metadata.newPrice}` : "";
      return { title: `Price Drop: ${productName}`, body: `${shopName} lowered the price of ${productName}${priceStr}!`, path };
    }
    if (eventType === "restock") {
      return { title: `Back in Stock: ${productName}`, body: `${shopName} restocked fresh ${productName}.`, path };
    }
    return { title: "New produce from a seller you follow", body: `${productName} is now available at ${shopName}`, path };
  }
  if (job.type === "buyer_message") {
    return {
      title: "New reply from a seller",
      body: job.itemCount === 1 ? "You have a new message" : `You have ${job.itemCount} new messages`,
      path: `/conversations/${job.referenceId ?? ""}`,
    };
  }
  if (job.type === "seller_boost") {
    const productName = typeof payload.productName === "string" ? payload.productName : "Your listing";
    return {
      title: "Boost your listing",
      body: `${productName} has a new price. Boost its visibility now?`,
      path: "/(app)/notifications",
    };
  }
  if (payload.orderId) {
    return {
      title: "New Reservation Received",
      body: typeof payload.summary === "string" ? payload.summary : "A buyer reserved produce from your stall",
      path: `/(app)/orders/${String(payload.orderId)}`,
    };
  }
  return {
    title: "New buyer messages",
    body: job.itemCount === 1 ? "A buyer sent you a message" : `You have ${job.itemCount} new buyer messages`,
    path: "/messages",
  };
}

function retryDelay(attempt: number) {
  return Math.min(30 * 60_000, 30_000 * (2 ** Math.max(0, attempt - 1)));
}

async function claimJobs() {
  return db.transaction(async (tx) => {
    const jobs = await tx.select().from(notification_outbox)
      .where(and(
        or(
          eq(notification_outbox.status, "pending"),
          and(
            eq(notification_outbox.status, "processing"),
            lte(notification_outbox.lockedAt, new Date(Date.now() - 5 * 60_000)),
          ),
        ),
        lte(notification_outbox.availableAt, new Date()),
      ))
      .orderBy(asc(notification_outbox.createdAt))
      .limit(batchLimit)
      .for("update", { skipLocked: true });
    if (!jobs.length) return [];
    const now = new Date();
    const claimed: OutboxJob[] = [];
    for (const job of jobs) {
      const [updated] = await tx.update(notification_outbox).set({
        status: "processing",
        lockedAt: now,
        attemptCount: sql`${notification_outbox.attemptCount} + 1`,
        updatedAt: now,
      }).where(eq(notification_outbox.id, job.id)).returning();
      if (updated) claimed.push(updated);
    }
    return claimed;
  });
}

async function finishJob(job: OutboxJob, status: "sent" | "failed", message?: string) {
  const now = new Date();
  await db.update(notification_outbox).set({
    status,
    sentAt: status === "sent" ? now : null,
    failedAt: status === "failed" ? now : null,
    lockedAt: null,
    lastError: message ?? null,
    updatedAt: now,
  }).where(eq(notification_outbox.id, job.id));
}

async function rescheduleJob(job: OutboxJob, message: string) {
  const now = new Date();
  if (job.attemptCount >= maxAttempts()) {
    await finishJob(job, "failed", message);
    return;
  }
  await db.update(notification_outbox).set({
    status: "pending",
    availableAt: new Date(now.getTime() + retryDelay(job.attemptCount)),
    lockedAt: null,
    lastError: message,
    updatedAt: now,
  }).where(eq(notification_outbox.id, job.id));
}

async function disableInvalidTokens(tokens: string[]) {
  if (!tokens.length) return;
  await db.update(notification_devices).set({
    isEnabled: false,
    invalidatedAt: new Date(),
    updatedAt: new Date(),
  }).where(inArray(notification_devices.pushToken, tokens));
}

async function deliverJob(job: OutboxJob) {
  const devices = await db.select({
    token: notification_devices.pushToken,
  }).from(notification_devices).where(and(
    eq(notification_devices.userId, job.recipientUserId),
    eq(notification_devices.isEnabled, true),
    isNull(notification_devices.invalidatedAt),
  ));
  if (!devices.length) {
    await finishJob(job, "sent", "No enabled notification devices");
    return;
  }

  const content = notificationContent(job);
  const messages: PushNotificationMessage[] = devices.map(({ token }) => ({
    token,
    title: content.title,
    body: content.body,
    data: {
      type: job.type,
      notificationId: job.id,
      referenceId: job.referenceId ?? "",
      path: content.path,
      collapseKey: job.aggregationKey,
    },
  }));

  let lastError: string | undefined;
  let successCount = 0;
  let invalidTokens: string[] = [];
  let retryable = false;
  for (let index = 0; index < messages.length; index += deviceBatchSize) {
    const result = await sendPushNotificationBatch(messages.slice(index, index + deviceBatchSize));
    if (!result.configured) {
      await finishJob(job, "failed", result.error);
      return;
    }
    successCount += result.successCount;
    invalidTokens = [...invalidTokens, ...result.invalidTokens];
    retryable ||= result.retryable;
    lastError = result.error ?? lastError;
  }
  await disableInvalidTokens(invalidTokens);
  if (retryable && successCount === 0) {
    await rescheduleJob(job, lastError ?? "Push provider request failed");
    return;
  }
  await finishJob(job, "sent", lastError);
}

export async function deliverPushNotifications() {
  const jobs = await claimJobs();
  let delivered = 0;
  let failed = 0;
  for (const job of jobs) {
    try {
      await deliverJob(job);
      delivered++;
    } catch (error) {
      failed++;
      await rescheduleJob(job, error instanceof Error ? error.message : "Push delivery failed");
    }
  }
  return { claimed: jobs.length, delivered, failed };
}

import { eq, sql } from "drizzle-orm";
import { notification_outbox, seller_notification_settings } from "../../db/schema";
import type { OrderTransaction } from "../order-types";
import { getSellerNoticeDef, type SellerNoticePayload } from "./messages";
import { inNightHours } from "./night";

export type SellerAlertChannel = "orders" | "updates";

const windowMs = () => {
  const seconds = Number(process.env.PUSH_SELLER_ALERT_WINDOW_SECONDS ?? 60);
  return Math.max(10, Math.min(seconds, 600)) * 1000;
};

export async function readSellerAlertSettings(tx: OrderTransaction, sellerId: string) {
  const [row] = await tx.select().from(seller_notification_settings)
    .where(eq(seller_notification_settings.sellerId, sellerId)).limit(1);
  return {
    stockPrice: row?.stockPrice ?? true,
    boost: row?.boost ?? true,
    account: row?.account ?? true,
    nightMode: row?.nightMode ?? false,
  };
}

/** Chat messages: ring, unless Night Mode is on and it is night. */
export async function sellerMessageChannel(tx: OrderTransaction, sellerId: string): Promise<SellerAlertChannel> {
  const settings = await readSellerAlertSettings(tx, sellerId);
  return settings.nightMode && inNightHours() ? "updates" : "orders";
}

/**
 * Queues one phone alert. Alerts of the same group inside one window become a single
 * outbox row whose itemCount and payload.counts grow. Feed-only kinds and switched-off
 * topics queue nothing.
 */
export async function enqueueSellerAlert(tx: OrderTransaction, input: {
  sellerId: string;
  kind: string;
  orderId?: string | null;
  payload?: SellerNoticePayload;
  createdAt?: Date;
}) {
  const def = getSellerNoticeDef(input.kind);
  if (!def || def.level === "feed") return;

  const settings = await readSellerAlertSettings(tx, input.sellerId);
  if (def.topic !== "orders") {
    const topicOn = def.topic === "stock_price" ? settings.stockPrice
      : def.topic === "boost" ? settings.boost : settings.account;
    if (!topicOn) return;
  }

  const channel: SellerAlertChannel = def.level === "sound"
    && !(settings.nightMode && inNightHours() && !def.nightExempt) ? "orders" : "updates";
  const group = channel === "orders" ? input.kind : "updates";

  const createdAt = input.createdAt ?? new Date();
  const size = windowMs();
  const windowStart = new Date(Math.floor(createdAt.getTime() / size) * size);
  const availableAt = new Date(windowStart.getTime() + size);
  const countPath = `{counts,${input.kind}}`;

  await tx.insert(notification_outbox).values({
    recipientUserId: input.sellerId,
    type: "seller_alert",
    aggregationKey: `seller-alert:${input.sellerId}:${group}`,
    dedupeKey: `${input.sellerId}:alert:${group}:${windowStart.toISOString()}`,
    referenceId: input.orderId ?? null,
    itemCount: 1,
    payload: { ...input.payload, kind: input.kind, channel, counts: { [input.kind]: 1 } },
    availableAt,
    createdAt,
    updatedAt: createdAt,
  }).onConflictDoUpdate({
    target: notification_outbox.dedupeKey,
    set: {
      itemCount: sql`${notification_outbox.itemCount} + 1`,
      payload: sql`jsonb_set(${notification_outbox.payload}, ${countPath}::text[], to_jsonb(coalesce((${notification_outbox.payload}->'counts'->>${input.kind}::text)::int, 0) + 1))`,
      updatedAt: createdAt,
    },
  });
}

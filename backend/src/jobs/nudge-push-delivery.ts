import { deliverPushNotifications } from "./deliver-push-notifications";

const lateMs = 150;
let timer: ReturnType<typeof setTimeout> | undefined;
let dueAt = Number.POSITIVE_INFINITY;

/**
 * Sends queued pushes at the moment the earliest one is due, instead of waiting for the 30 second check.
 * Called with the due time (epoch ms) of each newly queued alert. A later alert never delays an earlier one.
 * The 30 second check still runs as a safety net, and claiming is safe to run twice.
 */
export function nudgePushDelivery(dueAtMs: number) {
  const target = Math.max(dueAtMs, Date.now()) + lateMs;
  if (timer && dueAt <= target) return;
  if (timer) clearTimeout(timer);
  dueAt = target;
  timer = setTimeout(async () => {
    timer = undefined;
    dueAt = Number.POSITIVE_INFINITY;
    try {
      await deliverPushNotifications();
    } catch (error) {
      console.error("[Push] Nudged delivery error:", error);
    }
  }, Math.max(0, target - Date.now()));
}

import type { TrustActionType } from "./policy";

type Duration = string;

const restrictionReasons: Record<string, (duration: Duration) => string> = {
  buyer_failed_reservation: (d) => `Your account is paused because previous reservations were not picked up before they expired. To help avoid food waste, reservations are temporarily paused for ${d}.`,
  inquiry_non_response: (d) => `Your account is paused for ${d} because buyer questions were not answered in time. Please reply to buyers within 12 hours.`,
  seller_cancellation: (d) => `Your account is paused for ${d} because you cancelled several buyer reservations.`,
  low_rating: (d) => `Your account is paused for ${d} because buyers gave low ratings on completed pickups.`,
  misleading_product_info: (d) => `Your account is paused for ${d} because several buyers reported that your listings did not match what they received.`,
  inappropriate_communication: (d) => `Your account is paused for ${d} because several people reported inappropriate messages from your account.`,
  qr_misuse: (d) => `Your account is paused for ${d} because several people reported misuse of a pickup QR code.`,
};

const warningReasons: Record<string, string> = {
  buyer_failed_reservation: "You have missed pickups on previous reservations. To help avoid food waste, please collect your orders on time to avoid a 12-hour pause on your account.",
  inquiry_non_response: "Buyer questions went unanswered for too long. Please reply to buyers on time to avoid a pause on your account.",
  seller_cancellation: "You cancelled several buyer reservations. Please avoid cancelling to prevent a pause on your account.",
  low_rating: "Buyers gave low ratings on completed pickups. Please improve your service to avoid a pause on your account.",
  misleading_product_info: "Several buyers reported that your listings did not match what they received. Please keep listings accurate to avoid a pause on your account.",
  inappropriate_communication: "Several people reported inappropriate messages from your account. Please keep chats respectful to avoid a pause on your account.",
  qr_misuse: "Several people reported misuse of a pickup QR code. Please follow the pickup steps to avoid a block on your account.",
};

/** Plain-words reason that names what actually happened. It is stored on the action and shown to the person. */
export function trustActionReason(actionType: TrustActionType, triggerKind: string | null | undefined, durationLabel: Duration): string {
  const kind = triggerKind ?? "";
  if (actionType === "blocked") {
    return "Your account is blocked because your trust record reached the blocking level.";
  }
  if (actionType === "warning") {
    return warningReasons[kind] ?? "Your trust record reached the warning level. Please keep your transactions on time and accurate.";
  }
  return restrictionReasons[kind]?.(durationLabel)
    ?? `Your account is paused for ${durationLabel} because your trust record reached the pause level.`;
}

import { levelLabel, type TrustLevel } from "./level";

export type EventCopy = { what: string; rule: string; avoid: string };

/** What happened, which rule applied and how to avoid it, for every kind of event. */
export const eventCopy: Record<string, EventCopy> = {
  inquiry_non_response: { what: "A buyer's question went 48 hours without an answer.", rule: "Unanswered buyer question after 48 hours adds 1 point. Reminders at 12 and 24 hours carry 0 points, and the clock stops while Away mode is on.", avoid: "Answer buyer questions within 12 hours, or turn on Away mode when you cannot reply." },
  seller_cancellation: { what: "You cancelled a confirmed order.", rule: "A seller who cancels a confirmed order gets 2 points.", avoid: "Only confirm orders you can fill, and keep your stock numbers correct." },
  low_rating: { what: "A buyer gave a low rating (1 or 2 stars) on a completed order.", rule: "A low rating counts 1 point when the buyer wrote a reason, or when it is your 2nd low rating in 30 days.", avoid: "Pack fresh produce that matches the listing and answer buyers politely." },
  misleading_product_info: { what: "Two different people reported that your listing information was wrong.", rule: "Confirmed wrong listing information adds 2 points and counts in your fault rate.", avoid: "Keep amounts, prices and descriptions exact." },
  inappropriate_communication: { what: "Two different people reported inappropriate conduct.", rule: "Confirmed inappropriate conduct adds 2 points.", avoid: "Keep every message and pickup respectful." },
  seller_decline_fault: { what: "A buyer declined produce at pickup and it was confirmed as your fault.", rule: "A confirmed seller-fault decline adds 2 points and counts in your fault rate.", avoid: "Check every item before the buyer arrives." },
  qr_misuse: { what: "QR misuse was confirmed.", rule: "Confirmed QR misuse adds 3 points and blocks the account at once.", avoid: "Only scan a QR code for the right order, at the pickup." },
  buyer_failed_reservation: { what: "Your reservation ended and the pickup did not happen.", rule: "A missed pickup adds 2 points.", avoid: "Pick up inside your time range, or cancel early. Message the seller if something comes up." },
  buyer_late_cancellation: { what: "You cancelled within 3 hours of your pickup time.", rule: "A late cancellation adds 1 point.", avoid: "Cancel earlier, or ask the seller to move your pickup." },
  buyer_invalid_decline: { what: "You declined at pickup for a reason that is not allowed.", rule: "A decline without a valid reason adds 1 point, the same as a late cancellation.", avoid: "Only decline for spoiled, wrong, short or unsafe produce, and take a photo in the app." },
  buyer_fake_reports: { what: "You sent 3 reports in 14 days and none was confirmed.", rule: "Each group of 3 reports with none confirmed in 14 days adds 1 point.", avoid: "Only report what really happened, and write what you saw." },
  self_order: { what: "An order was made from your own stall.", rule: "An order from the seller's own account adds 3 points and blocks the account at once.", avoid: "Do not reserve produce from your own stall." },
  chat_spam: { what: "You sent the same message 5 or more times in 10 minutes.", rule: "You cannot send messages for 10 minutes. The 2nd time in 90 days adds 1 point.", avoid: "Send a message once and wait for a reply." },
  chat_personal_data: { what: "A chat message had a phone number or an email address, so it was hidden.", rule: "The 3rd hidden message in 90 days adds 1 point.", avoid: "Keep phone numbers and emails out of chat. Use the pickup details in the app." },
  buyer_false_photo: { what: "The photo you sent with a decline was confirmed false or reused.", rule: "A false or reused decline photo adds 2 points.", avoid: "Take a new photo of the real produce in the app." },
};

export function describeEvent(input: {
  kind: string; weight: number; score: number; level: TrustLevel; pauseHours?: number;
}) {
  const copy = eventCopy[input.kind] ?? { what: "A trust event was recorded.", rule: "Verified events add points.", avoid: "Follow the pickup steps." };
  const points = input.weight === 0 ? "This adds 0 points this time. It is counted, so repeating it can add points." : `This added ${input.weight} point${input.weight === 1 ? "" : "s"}.`;
  const hold = input.pauseHours ? ` It lasts ${input.pauseHours === 72 ? "3 days" : `${input.pauseHours} hours`}.` : "";
  return [
    copy.what, `Rule: ${copy.rule}`, points,
    `Your score for the last 90 days is ${input.score}. Your level is ${levelLabel[input.level]}.${hold}`,
    `How to avoid this next time: ${copy.avoid}`,
    "If you think this is wrong, you can dispute it within 7 days with a written reason.",
  ].join("\n");
}

export function describeLevelChange(level: TrustLevel, score: number, role: "buyer" | "seller", pauseHours = 0) {
  const rolePause = role === "buyer" ? "New reservations are off. Browsing and messages still work." : "New listings are off and Priority Boost is not available. You can still serve your orders.";
  const text: Record<TrustLevel, string> = {
    good: "Your account is in good standing.",
    notice: `Your score is ${score}. This is a notice. Nothing is restricted.`,
    warning: role === "buyer" ? `Your score is ${score}. You will see a warning when you reserve.` : `Your score is ${score}. A warning now shows in your dashboard.`,
    pause_24h: `Your score is ${score}. ${rolePause} It lasts 24 hours.`,
    pause_3d: `Your score is ${score}. ${rolePause} It lasts 3 days. You can ask for a review.`,
    block: `Your score is ${score}. Your account is blocked. You can restore it from the Agrivive recovery screen.`,
  };
  return `${text[level]}${pauseHours && level.startsWith("pause") ? "" : ""}\nPoints fade 90 days after the event, so you can recover by behaving well.`;
}

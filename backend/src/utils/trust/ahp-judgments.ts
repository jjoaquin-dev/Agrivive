import { pairMatrix, type TrustJudgments } from "./ahp-points";

/*
 * SAMPLE DATA. Not real judge answers.
 * Follows the Trust Points and AHP Guide: the 15 violations are split into four groups (pickup, listing, chat, review),
 * each group has its own pair matrix, and a small matrix ranks the groups. Cells that the guide's samples cover use the
 * guide's values (Sample 2 for buyer pickup faults, Sample 3 for chat, Sample 4 for the groups, QR misuse vs seller cancel = 3).
 * Replace each judge matrix with the real answers of the adviser, the City Agriculturist's Office, sellers and buyers,
 * add one matrix per judge (they are merged by geometric mean), and set `source` to "judges".
 * Saaty scale: 1 same, 3 a bit worse, 5 clearly worse, 7 much worse, 9 extreme; read as "row item is worse than column item".
 */

const pickup = [
  "qr_misuse", "self_order", "seller_cancellation", "buyer_failed_reservation",
  "seller_decline_fault", "buyer_false_photo", "buyer_invalid_decline", "buyer_late_cancellation",
] as const;
const listing = ["misleading_product_info", "inquiry_non_response"] as const;
const chat = ["inappropriate_communication", "chat_personal_data", "chat_spam"] as const;
const review = ["buyer_fake_reports", "low_rating"] as const;
const groupOrder = ["pickup", "listing", "chat", "review"] as const;

export const trustJudgments: TrustJudgments = {
  source: "sample",
  groupOrder,
  groupJudges: [pairMatrix(groupOrder, [
    ["pickup", "listing", 2], ["pickup", "chat", 4], ["pickup", "review", 3],
    ["listing", "chat", 3], ["listing", "review", 2], ["chat", "review", 1 / 2],
  ])],
  groups: {
    pickup: { items: pickup, judges: [pairMatrix(pickup, [
      ["qr_misuse", "self_order", 1], ["qr_misuse", "seller_cancellation", 3], ["qr_misuse", "buyer_failed_reservation", 4],
      ["qr_misuse", "seller_decline_fault", 4], ["qr_misuse", "buyer_false_photo", 5], ["qr_misuse", "buyer_invalid_decline", 6],
      ["qr_misuse", "buyer_late_cancellation", 8],
      ["self_order", "seller_cancellation", 3], ["self_order", "buyer_failed_reservation", 4], ["self_order", "seller_decline_fault", 4],
      ["self_order", "buyer_false_photo", 5], ["self_order", "buyer_invalid_decline", 6], ["self_order", "buyer_late_cancellation", 8],
      ["seller_cancellation", "buyer_failed_reservation", 2], ["seller_cancellation", "seller_decline_fault", 2],
      ["seller_cancellation", "buyer_false_photo", 3], ["seller_cancellation", "buyer_invalid_decline", 4], ["seller_cancellation", "buyer_late_cancellation", 6],
      ["buyer_failed_reservation", "seller_decline_fault", 1], ["buyer_failed_reservation", "buyer_false_photo", 2],
      ["buyer_failed_reservation", "buyer_invalid_decline", 3], ["buyer_failed_reservation", "buyer_late_cancellation", 5],
      ["seller_decline_fault", "buyer_false_photo", 2], ["seller_decline_fault", "buyer_invalid_decline", 3], ["seller_decline_fault", "buyer_late_cancellation", 5],
      ["buyer_false_photo", "buyer_invalid_decline", 2], ["buyer_false_photo", "buyer_late_cancellation", 3],
      ["buyer_invalid_decline", "buyer_late_cancellation", 2],
    ])] },
    listing: { items: listing, judges: [pairMatrix(listing, [["misleading_product_info", "inquiry_non_response", 3]])] },
    chat: { items: chat, judges: [pairMatrix(chat, [
      ["inappropriate_communication", "chat_personal_data", 3], ["inappropriate_communication", "chat_spam", 5], ["chat_personal_data", "chat_spam", 3],
    ])] },
    review: { items: review, judges: [pairMatrix(review, [["buyer_fake_reports", "low_rating", 2]])] },
  },
};

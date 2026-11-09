/** Table 8 of the PDF. Nothing else may be chosen. */
export const declineReasons = {
  spoiled: { valid: true, label: "Spoiled, rotten or moldy produce" },
  wilted_far: { valid: true, label: "Wilted or damaged far beyond the listing" },
  wrong_item: { valid: true, label: "Wrong item" },
  short_weight: { valid: true, label: "Weight or quantity short by more than 10%" },
  contamination: { valid: true, label: "Signs of contamination or pests" },
  small_size: { valid: false, label: "Size, shape or small blemishes on surplus or imperfect produce" },
  changed_mind: { valid: false, label: "Changed my mind" },
  no_longer_wants: { valid: false, label: "No longer want it" },
  arrived_late: { valid: false, label: "Arrived after the pickup time" },
} as const;

export type DeclineReason = keyof typeof declineReasons;
export const declineReasonKeys = Object.keys(declineReasons) as [DeclineReason, ...DeclineReason[]];
export const isValidDeclineReason = (reason: string) => declineReasons[reason as DeclineReason]?.valid === true;

/** The seller has this long to accept or dispute; silence counts as accepted. */
export const DECLINE_SELLER_HOURS = 24;
/** A decline photo must have been taken this recently. Older pictures cannot be used. */
export const DECLINE_PHOTO_MAX_AGE_MINUTES = 10;

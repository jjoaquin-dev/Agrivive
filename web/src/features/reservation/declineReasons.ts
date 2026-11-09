/** Table 8 of the Flagging and Trust PDF. The server accepts nothing else. */
export const declineReasons = [
  { key: "spoiled", label: "Spoiled, rotten or moldy produce", valid: true },
  { key: "wilted_far", label: "Wilted or damaged far beyond the listing", valid: true },
  { key: "wrong_item", label: "Wrong item", valid: true },
  { key: "short_weight", label: "Weight or quantity short by more than 10%", valid: true },
  { key: "contamination", label: "Signs of contamination or pests", valid: true },
  { key: "small_size", label: "Size, shape or small blemishes on surplus or imperfect produce", valid: false },
  { key: "changed_mind", label: "I changed my mind", valid: false },
  { key: "no_longer_wants", label: "I no longer want it", valid: false },
  { key: "arrived_late", label: "I arrived after the pickup time", valid: false },
] as const;

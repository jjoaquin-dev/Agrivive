import type { ReportReason } from "./api/reports";

/** Backend rule: details need at least 20 characters (REPORT_MIN_DETAILS). */
export const REPORT_MIN_DETAILS = 20;

/** "counts" means the reason can become a scored violation when 2 different people report the same thing. */
export const REPORT_REASONS: { value: ReportReason; label: string; description: string; counts: boolean }[] = [
  { value: "pickup_problem", label: "Pickup Problem", description: "Seller was absent or produce unavailable.", counts: false },
  { value: "listing_inaccurate", label: "Listing Inaccurate", description: "Produce quality or quantity differed from description.", counts: true },
  { value: "qr_misuse", label: "QR Code Misuse", description: "Someone used or shared a pickup QR code the wrong way.", counts: true },
  { value: "conduct", label: "Seller Conduct", description: "Unprofessional or inappropriate behavior.", counts: true },
  { value: "other", label: "Other Issue", description: "Any other problem with this transaction.", counts: false },
];

export const reportCountsHint = (counts: boolean) => counts
  ? "This reason counts. When 2 different people report the same thing about the same seller, it is confirmed and adds trust points."
  : "This reason is saved on the record. It adds no trust points by itself.";

/** A seller who has not used the app for this long shows as Away to buyers. It only changes what buyers see: orders, pickup times, QR codes and the 3-hour auto-confirm are not touched. */
export const AWAY_AFTER_MINUTES = 30;

export function isSellerAway(lastActiveAt: Date | null | undefined, now = new Date()) {
  return !lastActiveAt || now.getTime() - lastActiveAt.getTime() > AWAY_AFTER_MINUTES * 60_000;
}

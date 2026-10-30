import { formatRemainingTime } from "./access";

export function resolveCancellationCooldownHours(cancelCount: number): number {
  if (cancelCount >= 10) return 72; // 3 days
  if (cancelCount >= 9) return 24;  // 24 hours
  if (cancelCount >= 7) return 12;  // 12 hours
  return 0; // 5-6 is warning only (no lock)
}

export function resolveCancellationWarning(cancelCount: number): string | null {
  if (cancelCount >= 5 && cancelCount < 7) {
    return `You have canceled ${cancelCount} reservations. To help market vendors plan surplus stock, please avoid frequent cancellations. Reaching 7 cancellations will temporarily pause reservations for 12 hours.`;
  }
  return null;
}

export function resolveCancellationRestrictionMessage(
  cancelCount: number,
  endsAt: Date | null
): { message: string; remainingText: string; durationText: string } {
  const diffMs = endsAt ? endsAt.getTime() - Date.now() : 0;
  const remainingText = formatRemainingTime(diffMs);
  const durationText =
    cancelCount >= 10 ? "3 days" : cancelCount >= 9 ? "24 hours" : "12 hours";

  return {
    message: `Your account is paused because you have reached ${cancelCount} canceled reservations. To help market vendors plan surplus stock, reservations are temporarily paused for ${durationText}. Please come back in ${remainingText}.`,
    remainingText,
    durationText,
  };
}

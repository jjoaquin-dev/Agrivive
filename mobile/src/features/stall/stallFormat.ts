export const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function minuteLabel(minute: number) {
  const h = Math.floor(minute / 60) % 24;
  return `${h % 12 || 12}:${String(minute % 60).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

/** Times move in 30-minute steps so the seller taps instead of typing. */
export function stepMinute(minute: number, direction: 1 | -1, min = 0, max = 1440) {
  return Math.min(max, Math.max(min, minute + direction * 30));
}

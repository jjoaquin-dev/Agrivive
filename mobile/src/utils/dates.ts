/** Agrivive runs on Philippine time, so every date a seller sees is shown in Asia/Manila whatever the phone's timezone is. */
const timeZone = "Asia/Manila";

const toDate = (value: string | number | Date) => (value instanceof Date ? value : new Date(value));

/** "Nov 12, 3:30 PM" */
export const formatDateTime = (value: string | number | Date) =>
  toDate(value).toLocaleString("en-US", { timeZone, month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/** "Nov 12", or "Nov 12, 2026" with the year. */
export const formatDate = (value: string | number | Date, withYear = false) =>
  toDate(value).toLocaleDateString("en-US", { timeZone, month: "short", day: "numeric", ...(withYear ? { year: "numeric" } : {}) });

/** "3:30 PM" */
export const formatTime = (value: string | number | Date) =>
  toDate(value).toLocaleTimeString("en-US", { timeZone, hour: "numeric", minute: "2-digit" });

/** "Just now", "5 min ago", "3 hrs ago", "Yesterday", "Mon", then "Nov 12". Bad dates show "Recently". */
export function formatRelativeTime(value: string | number | Date) {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return date.toLocaleDateString("en-US", { timeZone, weekday: "short" });
  return formatDate(date);
}

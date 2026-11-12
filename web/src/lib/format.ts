/** One place for dates, times and numbers. Everything uses Philippine English and Manila time. */
const locale = "en-PH";
const timeZone = "Asia/Manila";

type DateInput = string | number | Date;

export function formatDate(value: DateInput, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) {
  return new Date(value).toLocaleDateString(locale, { timeZone, ...options });
}

export function formatTime(value: DateInput, options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" }) {
  return new Date(value).toLocaleTimeString(locale, { timeZone, ...options });
}

export function formatDateTime(value: DateInput, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) {
  return new Date(value).toLocaleString(locale, { timeZone, ...options });
}

export function formatNumber(value: number | string, options?: Intl.NumberFormatOptions) {
  return Number(value).toLocaleString(locale, options);
}

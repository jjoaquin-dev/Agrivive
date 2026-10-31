const timeZone = "Asia/Manila";

/** Night Mode hours: 9 PM to 6 AM in the Philippines. */
export function inNightHours(now: Date = new Date()) {
  const hour = Number(new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hourCycle: "h23",
  }).format(now));
  return hour >= 21 || hour < 6;
}

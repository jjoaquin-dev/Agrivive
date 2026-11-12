const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Monday first, like a shop sign.
const ORDER = [1, 2, 3, 4, 5, 6, 0];

type Hours = { weekday: number; isClosed: boolean; opensMinute: number; closesMinute: number };

function clock(minute: number) {
  const h = Math.floor(minute / 60);
  const m = String(minute % 60).padStart(2, "0");
  return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

/** Groups neighbouring days with the same hours, e.g. "Mon–Fri  6:00 AM – 8:00 PM". */
export function formatOpeningHours(hours: Hours[]): { days: string; time: string }[] {
  const byDay = new Map(hours.map((row) => [row.weekday, row]));
  const rows: { days: string[]; time: string }[] = [];
  for (const weekday of ORDER) {
    const row = byDay.get(weekday);
    if (!row) continue;
    const time = row.isClosed ? "Closed" : `${clock(row.opensMinute)} – ${clock(row.closesMinute)}`;
    const last = rows[rows.length - 1];
    if (last && last.time === time) last.days.push(DAYS[weekday]);
    else rows.push({ days: [DAYS[weekday]], time });
  }
  return rows.map(({ days, time }) => ({
    days: days.length > 1 ? `${days[0]}–${days[days.length - 1]}` : days[0],
    time,
  }));
}

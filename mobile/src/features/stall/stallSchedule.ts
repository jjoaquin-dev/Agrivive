export interface HoursDay { weekday: number; isClosed: boolean; opensMinute: number; closesMinute: number }
export interface ScheduleCard { opensMinute: number; closesMinute: number; weekdays: number[] }

/** Monday first, the way people read a week. Sunday is 0 in the saved data. */
export const weekOrder = [1, 2, 3, 4, 5, 6, 0];
export const is24Hours = (opensMinute: number, closesMinute: number) => opensMinute === 0 && closesMinute === 1440;

/** Open days that share the same hours become one card, like one alarm with the days it repeats on. */
export function groupDays(days: HoursDay[]): ScheduleCard[] {
  const cards: ScheduleCard[] = [];
  for (const weekday of weekOrder) {
    const day = days.find((row) => row.weekday === weekday);
    if (!day || day.isClosed) continue;
    const card = cards.find((item) => item.opensMinute === day.opensMinute && item.closesMinute === day.closesMinute);
    if (card) card.weekdays.push(weekday);
    else cards.push({ opensMinute: day.opensMinute, closesMinute: day.closesMinute, weekdays: [weekday] });
  }
  return cards;
}

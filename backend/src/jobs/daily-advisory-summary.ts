import { heatAlertFor, holidayDueForAlert } from "../utils/advisory-alerts";
import type { SellerAdvisoriesResponse } from "../modules/seller/model/seller.advisories";

function weatherWords(code: number) {
  if (code === 0 || code === 1) return "Sunny";
  if (code === 2) return "Partly cloudy";
  if (code === 3 || code === 45 || code === 48) return "Cloudy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Fair";
}

function dayLabel(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-PH", { month: "long", day: "numeric", timeZone: "UTC" });
}

/** One short plain-words line: today's weather, a heat alert if one applies, then tomorrow's holiday or the next one. Empty when neither is available. */
export function buildDailyAdvisorySummary(advisories: SellerAdvisoriesResponse) {
  const parts: string[] = [];
  const current = advisories.weather?.current;
  if (current) {
    parts.push(`Weather: ${weatherWords(current.weatherCode)}, ${Math.round(current.temperatureC)}°C, ${Math.round(current.precipitationProbability)}% chance of rain.`);
  }
  const heat = heatAlertFor(advisories.weather?.forecast);
  if (heat) parts.push(`Heat alert: it may reach ${heat.temperatureMaxC}°C ${heat.when}.`);
  const tomorrow = holidayDueForAlert(advisories.holidays.upcoming);
  const holiday = advisories.holidays.upcoming[0];
  if (tomorrow) parts.push(`Tomorrow is ${tomorrow.name}.`);
  else if (holiday) parts.push(`Next holiday: ${holiday.name} on ${dayLabel(holiday.date)}.`);
  return parts.join(" ");
}

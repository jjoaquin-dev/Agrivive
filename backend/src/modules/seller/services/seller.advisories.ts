import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_profile } from "../../../db/schema";
import { requireActiveUser } from "../../../utils/order-access";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import type { SellerAdvisoriesResponse } from "../model/seller.advisories";
import { fetchPhilippineHolidays } from "./seller.holidays";
import { fetchSellerWeather } from "./seller.weather";

const rainyCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);

function createReminders(
  weather: Awaited<ReturnType<typeof fetchSellerWeather>>,
  holidays: Awaited<ReturnType<typeof fetchPhilippineHolidays>>,
): SellerAdvisoriesResponse["reminders"] {
  const reminders: SellerAdvisoriesResponse["reminders"] = [];
  if (weather) {
    const rainExpected = weather.forecast.some((day) => day.precipitationProbability >= 60 || rainyCodes.has(day.weatherCode));
    const hotExpected = weather.forecast.some((day) => day.temperatureMaxC >= 35);
    if (rainExpected) reminders.push({ kind: "weather", message: "Rain is expected. Plan covered handling and inspect stored produce." });
    if (hotExpected) reminders.push({ kind: "weather", message: "Hot weather is expected. Inspect stored produce and review handling plans." });
  }
  if (holidays?.upcoming.length) {
    reminders.push({ kind: "holiday", message: "Review pickup availability and selling plans around the upcoming public holiday." });
  }
  return reminders;
}

export async function getSellerAdvisories(sellerId: string): Promise<SellerAdvisoriesResponse> {
  const context = await db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId, false);
    await requireActiveUser(tx, sellerId, "seller");
    const [current] = await tx.select({ latitude: sellers_profile.latitude, longitude: sellers_profile.longitude })
      .from(sellers_profile)
      .where(and(eq(sellers_profile.userId, sellerId), eq(sellers_profile.isCurrent, true)))
      .limit(1);
    return { profile: current ?? null };
  });
  const profile = context.profile;

  const generatedAt = new Date().toISOString();
  if (!profile || profile.latitude === null || profile.longitude === null) {
    const holidayResult = await Promise.allSettled([
      fetchPhilippineHolidays(new Date().getUTCFullYear()),
    ]);
    const holidays = holidayResult[0].status === "fulfilled" ? holidayResult[0].value : null;
    return {
      generatedAt,
      location: null,
      weather: null,
      holidays: holidays ?? { available: false, upcoming: [] },
      reminders: [
        { kind: "location", message: "Add a seller location to receive local weather advisories." },
        ...(holidays?.upcoming.length ? [{ kind: "holiday" as const, message: "Review pickup availability and selling plans around the upcoming public holiday." }] : []),
      ],
      sources: { weather: "unavailable", holidays: holidays ? "available" : "unavailable" },
    };
  }

  const [weatherResult, holidayResult] = await Promise.allSettled([
    fetchSellerWeather(profile.latitude, profile.longitude),
    fetchPhilippineHolidays(new Date().getUTCFullYear()),
  ]);
  const weather = weatherResult.status === "fulfilled" ? weatherResult.value : null;
  const holidays = holidayResult.status === "fulfilled" ? holidayResult.value : null;

  return {
    generatedAt,
    location: { latitude: profile.latitude, longitude: profile.longitude },
    weather,
    holidays: holidays ?? { available: false, upcoming: [] },
    reminders: createReminders(weather, holidays),
    sources: {
      weather: weather ? "available" : "unavailable",
      holidays: holidays ? "available" : "unavailable",
    },
  };
}

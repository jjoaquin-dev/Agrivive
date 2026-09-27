type WeatherForecast = {
  available: true;
  current: {
    temperatureC: number;
    precipitationProbability: number;
    weatherCode: number;
  };
  forecast: Array<{
    date: string;
    temperatureMaxC: number;
    temperatureMinC: number;
    precipitationProbability: number;
    weatherCode: number;
  }>;
};

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
  };
};

import { fetchAdvisorySource } from "../../../utils/advisory-http";

const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; value: WeatherForecast | null }>();

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function fetchSellerWeather(latitude: number, longitude: number): Promise<WeatherForecast | null> {
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);
  let value: WeatherForecast | null = null;

  try {
    const query = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: "temperature_2m,weather_code",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      forecast_days: "3",
      timezone: "auto",
    });
    const response = await fetchAdvisorySource(
      `https://api.open-meteo.com/v1/forecast?${query.toString()}`,
      controller.signal,
    );
    if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
    const payload = await response.json() as OpenMeteoResponse;
    const daily = payload.daily;
    const arrays = [
      daily?.time,
      daily?.weather_code,
      daily?.temperature_2m_max,
      daily?.temperature_2m_min,
      daily?.precipitation_probability_max,
    ];
    const requiredDays = 3;
    if (!payload.current || !arrays.every((items) => Array.isArray(items) && items.length >= requiredDays) ||
      !finiteNumber(payload.current.temperature_2m) || !finiteNumber(payload.current.weather_code)) {
      throw new Error("Open-Meteo response was incomplete");
    }

    const [dates, codes, maximums, minimums, probabilities] = arrays as [string[], number[], number[], number[], number[]];
    if (![...codes.slice(0, requiredDays), ...maximums.slice(0, requiredDays), ...minimums.slice(0, requiredDays), ...probabilities.slice(0, requiredDays)].every(finiteNumber)) {
      throw new Error("Open-Meteo response contained invalid values");
    }
    value = {
      available: true,
      current: {
        temperatureC: payload.current.temperature_2m,
        precipitationProbability: probabilities[0],
        weatherCode: payload.current.weather_code,
      },
      forecast: dates.slice(0, 3).map((date, index) => ({
        date,
        temperatureMaxC: maximums[index],
        temperatureMinC: minimums[index],
        precipitationProbability: probabilities[index],
        weatherCode: codes[index],
      })),
    };
  } catch (error) {
    console.warn("Seller weather source unavailable", error instanceof Error ? error.message : "request failed");
    value = null;
  } finally {
    clearTimeout(timeout);
  }

  if (value) {
    cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, value });
  } else {
    cache.delete(key);
  }
  return value;
}

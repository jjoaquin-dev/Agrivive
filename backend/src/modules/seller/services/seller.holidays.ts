type Holiday = {
  date: string;
  name: string;
  localName: string;
};

type HolidayResponse = {
  available: true;
  upcoming: Holiday[];
};

type NagerHoliday = {
  date?: string;
  name?: string;
  localName?: string;
};

import { fetchAdvisorySource } from "../../../utils/advisory-http";

const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map<number, { expiresAt: number; value: HolidayResponse | null }>();

export async function fetchPhilippineHolidays(year: number): Promise<HolidayResponse | null> {
  const cached = cache.get(year);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);
  let value: HolidayResponse | null = null;

  try {
    const response = await fetchAdvisorySource(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/PH`,
      controller.signal,
    );
    if (!response.ok) throw new Error(`Nager.Date returned ${response.status}`);
    const payload = await response.json() as NagerHoliday[];
    if (!Array.isArray(payload)) throw new Error("Nager.Date response was incomplete");

    const today = new Date().toISOString().slice(0, 10);
    const cutoff = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const upcoming = payload
      .filter((holiday): holiday is Required<NagerHoliday> =>
        typeof holiday.date === "string" && typeof holiday.name === "string" && typeof holiday.localName === "string" &&
        holiday.date >= today && holiday.date <= cutoff,
      )
      .map((holiday) => ({ date: holiday.date, name: holiday.name, localName: holiday.localName }));
    value = { available: true, upcoming };
  } catch (error) {
    console.warn("Philippine holiday source unavailable", error instanceof Error ? error.message : "request failed");
    value = null;
  } finally {
    clearTimeout(timeout);
  }

  if (value) {
    cache.set(year, { expiresAt: Date.now() + CACHE_TTL_MS, value });
  } else {
    cache.delete(year);
  }
  return value;
}

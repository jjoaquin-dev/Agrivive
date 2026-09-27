export type AdvisoryKind = "weather" | "holiday" | "location";

export interface SellerAdvisoryWeatherDay {
  date: string;
  temperatureMaxC: number;
  temperatureMinC: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface SellerAdvisoriesResponse {
  generatedAt: string;
  location: { latitude: number; longitude: number } | null;
  weather: {
    available: boolean;
    current: {
      temperatureC: number;
      precipitationProbability: number;
      weatherCode: number;
    } | null;
    forecast: SellerAdvisoryWeatherDay[];
  } | null;
  holidays: {
    available: boolean;
    upcoming: { date: string; name: string; localName: string }[];
  };
  reminders: { kind: AdvisoryKind; message: string }[];
  sources: { weather: "available" | "unavailable"; holidays: "available" | "unavailable" };
}

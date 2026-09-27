import { t } from "elysia";

export const sellerAdvisoriesResponse = t.Object({
  generatedAt: t.String({ format: "date-time" }),
  location: t.Nullable(t.Object({
    latitude: t.Number(),
    longitude: t.Number(),
  })),
  weather: t.Nullable(t.Object({
    available: t.Boolean(),
    current: t.Nullable(t.Object({
      temperatureC: t.Number(),
      precipitationProbability: t.Number(),
      weatherCode: t.Number(),
    })),
    forecast: t.Array(t.Object({
      date: t.String({ format: "date" }),
      temperatureMaxC: t.Number(),
      temperatureMinC: t.Number(),
      precipitationProbability: t.Number(),
      weatherCode: t.Number(),
    })),
  })),
  holidays: t.Object({
    available: t.Boolean(),
    upcoming: t.Array(t.Object({
      date: t.String({ format: "date" }),
      name: t.String(),
      localName: t.String(),
    })),
  }),
  reminders: t.Array(t.Object({
    kind: t.Union([
      t.Literal("weather"),
      t.Literal("holiday"),
      t.Literal("location"),
    ]),
    message: t.String(),
  })),
  sources: t.Object({
    weather: t.Union([t.Literal("available"), t.Literal("unavailable")]),
    holidays: t.Union([t.Literal("available"), t.Literal("unavailable")]),
  }),
});

export type SellerAdvisoriesResponse = typeof sellerAdvisoriesResponse.static;

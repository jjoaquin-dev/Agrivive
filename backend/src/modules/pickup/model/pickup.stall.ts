import { t } from "elysia";

const day = t.Object({
  weekday: t.Integer({ minimum: 0, maximum: 6 }),
  isClosed: t.Boolean(),
  opensMinute: t.Integer({ minimum: 0, maximum: 1439 }),
  closesMinute: t.Integer({ minimum: 1, maximum: 1440 }),
});

export const stallHoursBody = t.Object({ days: t.Array(day, { minItems: 7, maxItems: 7 }) });
export const stallSettingsBody = t.Object({
  pickupWithinMinutes: t.Integer({ minimum: 15, maximum: 480 }),
});
export const stallClosedBody = t.Object({ closed: t.Boolean() });
export const stallAwayBody = t.Object({
  away: t.Boolean(),
  days: t.Optional(t.Integer({ minimum: 1, maximum: 14 })),
  reason: t.Optional(t.String({ maxLength: 200 })),
});

export type StallHoursBody = typeof stallHoursBody.static;
export type StallSettingsBody = typeof stallSettingsBody.static;
export type StallAwayBody = typeof stallAwayBody.static;

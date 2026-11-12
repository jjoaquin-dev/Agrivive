import { t } from "elysia";

const day = t.Object({
  weekday: t.Integer({ minimum: 0, maximum: 6 }),
  isClosed: t.Boolean(),
  opensMinute: t.Integer({ minimum: 0, maximum: 1439 }),
  closesMinute: t.Integer({ minimum: 1, maximum: 1440 }),
});

export const stallHoursBody = t.Object({ days: t.Array(day, { minItems: 7, maxItems: 7 }) });
export const stallClosedBody = t.Object({ closed: t.Boolean() });

export type StallHoursBody = typeof stallHoursBody.static;

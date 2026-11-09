import { t } from "elysia";

export const rescheduleProposeBody = t.Object({
  pickupStart: t.String({ format: "date-time" }),
  pickupEnd: t.String({ format: "date-time" }),
  reason: t.String({ minLength: 5, maxLength: 300 }),
});
export const rescheduleRespondBody = t.Object({ accept: t.Boolean() });
export type RescheduleProposeBody = typeof rescheduleProposeBody.static;

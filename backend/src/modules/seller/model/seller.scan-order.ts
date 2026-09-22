import { t } from "elysia";

export const scanOrderBody = t.Object({
  qrPayload: t.String({ minLength: 1, maxLength: 128 }),
});

export type ScanOrderInput = typeof scanOrderBody.static;

export const orderIdParams = t.Object({
  id: t.String({ format: "uuid" }),
});

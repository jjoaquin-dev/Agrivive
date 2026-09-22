import { t } from "elysia";

export const scanOrderBody = t.Object({
  qrPayload: t.String({ minLength: 1, maxLength: 128 }),
});

export type ScanOrderInput = typeof scanOrderBody.static;

export const orderIdParams = t.Object({
  id: t.String({ format: "uuid" }),
});

export const orderListQuery = t.Object({
  limit: t.Optional(t.String({ pattern: "^(?:[1-9]|[1-4][0-9]|50)$" })),
  cursor: t.Optional(t.String({ format: "uuid" })),
});

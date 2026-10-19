import { t } from "elysia";

export const scanOrderItemAdjustment = t.Object({
  itemId: t.String({ format: "uuid" }),
  dispensedQuantity: t.Number({ minimum: 0 }),
});

export const scanOrderBody = t.Object({
  qrPayload: t.String({ minLength: 1, maxLength: 128 }),
  items: t.Optional(t.Array(scanOrderItemAdjustment)),
});

export type ScanOrderInput = typeof scanOrderBody.static;

export const orderIdParams = t.Object({
  id: t.String({ format: "uuid" }),
});

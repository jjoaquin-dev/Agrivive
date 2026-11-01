import { t } from "elysia";

export const sellerPriceReductionToggleBody = t.Object({
  enabled: t.Boolean(),
  // Set the drop amount (pesos every 6 hours) and final price in the same call.
  amount: t.Optional(t.Number({ minimum: 0.01 })),
  minimumPrice: t.Optional(t.Number({ minimum: 1 })),
});

export const sellerPriceDropHistoryQuery = t.Optional(t.Object({
  limit: t.Optional(t.Integer({ minimum: 1, maximum: 50 })),
  cursor: t.Optional(t.String()),
}));

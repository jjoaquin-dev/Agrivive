import { t } from "elysia";

export const sellerPriceReductionToggleBody = t.Object({ enabled: t.Boolean() });

export const sellerPriceDropHistoryQuery = t.Optional(t.Object({
  limit: t.Optional(t.Integer({ minimum: 1, maximum: 50 })),
  cursor: t.Optional(t.String()),
}));

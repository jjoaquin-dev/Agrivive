import { t } from "elysia";

export const promotionJobParams = t.Object({ id: t.String({ format: "uuid" }) });

export const promotionDraftBody = t.Object({
  headline: t.String({ minLength: 1, maxLength: 80 }),
  caption: t.String({ minLength: 1, maxLength: 280 }),
});

export const promotionFailureBody = t.Object({
  code: t.Union([
    t.Literal("model_failed"),
    t.Literal("invalid_draft"),
    t.Literal("callback_failed"),
  ]),
});

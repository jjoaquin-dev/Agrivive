import { t } from "elysia";

export const visibilityBoostParams = t.Object({ id: t.String({ format: "uuid" }) });

export const visibilityBoostHeaders = t.Object({ authorization: t.Optional(t.String()) });

export const visibilityBoostFacebookPostBody = t.Object({
  caption: t.String({ minLength: 1, maxLength: 2000 }),
});

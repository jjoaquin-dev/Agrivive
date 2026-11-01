import { t } from "elysia";

export const visibilityBoostParams = t.Object({ id: t.String({ format: "uuid" }) });

export const visibilityBoostHeaders = t.Object({ authorization: t.Optional(t.String()) });

export const visibilityBoostFacebookPostBody = t.Object({
  postType: t.Union([t.Literal("first_post"), t.Literal("second_post")]),
  caption: t.String({ minLength: 1, maxLength: 2000 }),
});

export type VisibilityBoostFacebookPostBody = typeof visibilityBoostFacebookPostBody.static;

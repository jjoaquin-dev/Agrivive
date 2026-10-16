import { t } from "elysia";

export const authPasswordSetBody = t.Object({
  newPassword: t.String({ minLength: 8 }),
  confirmPassword: t.String({ minLength: 8 }),
});

export type AuthPasswordSetBody = typeof authPasswordSetBody.static;

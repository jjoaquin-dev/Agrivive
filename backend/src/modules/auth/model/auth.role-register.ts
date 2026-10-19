import { t } from "elysia";

export const authRoleRegisterBody = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  name: t.Optional(t.String()),
  targetRole: t.Union([t.Literal("buyer"), t.Literal("seller")]),
});

export const authRoleCheckBody = t.Object({
  email: t.String({ format: "email" }),
  targetRole: t.Union([t.Literal("buyer"), t.Literal("seller")]),
});

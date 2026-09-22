import { t } from "elysia";

export const orderIdParams = t.Object({
  id: t.String({ format: "uuid" }),
});

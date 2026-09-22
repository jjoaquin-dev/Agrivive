import { t } from "elysia";

export const orderListQuery = t.Object({
  limit: t.Optional(t.String({ pattern: "^(?:[1-9]|[1-4][0-9]|50)$" })),
  cursor: t.Optional(t.String({ format: "uuid" })),
});

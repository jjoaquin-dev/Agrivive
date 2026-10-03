import { t } from "elysia";

export const buyerNoticeParams = t.Object({
  id: t.String({ format: "uuid" }),
});

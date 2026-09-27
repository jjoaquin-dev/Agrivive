import { t } from "elysia";

export const sellerProductShareParams = t.Object({ id: t.String({ format: "uuid" }) });

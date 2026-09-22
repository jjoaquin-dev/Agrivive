import { t } from "elysia";

export const buyerReportParams = t.Object({ id: t.String({ format: "uuid" }) });
export const buyerReportBody = t.Object({
  reason: t.UnionEnum(["pickup_problem", "conduct", "listing_inaccurate", "other"]),
  details: t.String({ minLength: 5, maxLength: 2000 }),
});
export type BuyerReportBody = typeof buyerReportBody.static;

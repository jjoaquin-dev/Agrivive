import { t } from "elysia";

export const sellerReportParams = t.Object({ id: t.String({ format: "uuid" }) });
export const sellerReportBody = t.Object({
  reason: t.UnionEnum(["pickup_problem", "conduct", "listing_inaccurate", "other"]),
  details: t.String({ minLength: 5, maxLength: 2000 }),
});
export type SellerReportBody = typeof sellerReportBody.static;

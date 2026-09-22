import { t } from "elysia";

export const sellerProfileModel = t.Object({
  shopName: t.String({ minLength: 1, maxLength: 120, pattern: "\\S" }),
  detailAddress: t.String({ minLength: 1, maxLength: 500, pattern: "\\S" }),
  latitude: t.Number({ minimum: -90, maximum: 90 }),
  longitude: t.Number({ minimum: -180, maximum: 180 }),
  phoneNumber: t.String({ minLength: 7, maxLength: 30, pattern: "\\S" }),
}, { additionalProperties: false });

export type SellerProfileCreate = typeof sellerProfileModel.static;

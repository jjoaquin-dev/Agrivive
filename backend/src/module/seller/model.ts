import { t } from "elysia";

export const sellerProfileModel = t.Object({
  shopName: t.String(),
  detailAddress: t.String(),
  latitude: t.Number(),
  longitude: t.Numeric(),
  phoneNumber: t.String(),
});

export type sellerModel = typeof sellerProfileModel.static;

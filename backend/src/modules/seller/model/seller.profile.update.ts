import { t } from "elysia";
import { sellerProfileModel } from "./seller.profile.create";

export const sellerProfileUpdateModel = t.Partial(sellerProfileModel, { minProperties: 1, additionalProperties: false });
export type SellerProfileUpdate = typeof sellerProfileUpdateModel.static;

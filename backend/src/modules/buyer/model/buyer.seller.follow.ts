import { t } from "elysia";

export const buyerSellerFollowParams = t.Object({
  sellerId: t.String({ minLength: 1 }),
});

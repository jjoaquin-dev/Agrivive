import { t } from "elysia";

export const buyerWishlistProductParams = t.Object({
  productId: t.String({ format: "uuid" }),
});


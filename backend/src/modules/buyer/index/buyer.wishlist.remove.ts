import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { buyerWishlistProductParams } from "../model/buyer.wishlist";
import { removeBuyerWishlistProduct } from "../services/buyer.wishlist.remove";

export const buyerWishlistRemoveRoute = new Elysia().use(sessionAuth)
  .delete("/wishlist/:productId", async ({ session, params }) => removeBuyerWishlistProduct(session.userId, params.productId), {
    role: ["buyer"],
    params: buyerWishlistProductParams,
  });


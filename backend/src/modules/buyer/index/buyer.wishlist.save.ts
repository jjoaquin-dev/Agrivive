import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { buyerWishlistProductParams } from "../model/buyer.wishlist";
import { saveBuyerWishlistProduct } from "../services/buyer.wishlist.save";

export const buyerWishlistSaveRoute = new Elysia().use(sessionAuth)
  .post("/wishlist/:productId", async ({ session, params, status }) => {
    try {
      return await saveBuyerWishlistProduct(session.userId, params.productId);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to save product" });
    }
  }, { role: ["buyer"], params: buyerWishlistProductParams });


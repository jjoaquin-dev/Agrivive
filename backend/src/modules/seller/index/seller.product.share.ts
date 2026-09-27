import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerProductShareParams } from "../model/seller.product.share";
import { getSellerProductShare } from "../services/seller.product.share";

export const sellerProductShareRoute = new Elysia().use(sessionAuth)
  .get("/products/:id/share", async ({ session, params, status }) => {
    try { return await getSellerProductShare(session.userId, params.id); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to prepare product share" });
    }
  }, { role: ["seller"], params: sellerProductShareParams });

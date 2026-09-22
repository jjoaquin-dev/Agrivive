import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerProductImageModel } from "../model/seller.product.image";
import { uploadSellerProductImage } from "../services/seller.product.image";

export const sellerProductImageRoute = new Elysia().use(sessionAuth)
  .post("/product-images", async ({ session, body, status }) => {
    try {
      return await uploadSellerProductImage(session.userId, body.file);
    } catch (error) {
      if (error instanceof OrderError) {
        return status(error.statusCode, { message: error.message });
      }
      console.error("[Seller Product Image Error]:", error);
      return status(500, { message: (error as any)?.message || "Failed to upload product photo" });
    }
  }, {
    role: ["seller"],
    body: sellerProductImageModel,
  });
